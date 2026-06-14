// src/lib/algorithms.ts
import { MakananSiapSaji, OlahragaRekomendasi, RekomendasiMenu, MacroTargets, HolisticProtocol, PredictionEngine } from '../types';
import latihanDatasetRaw from '../data/latihan_fisik.json';

const latihanDataset = latihanDatasetRaw as any[];

export function calculateEnergi(umur: number, gender: string, berat: number, tinggi: number, levelAktivitas: string, targetDiet: string = 'stabil') {
  let bmr = gender === 'pria' 
    ? (10 * berat) + (6.25 * tinggi) - (5 * umur) + 5
    : (10 * berat) + (6.25 * tinggi) - (5 * umur) - 161;

  const activityMultiplier: { [key: string]: number } = {
    'sedentary': 1.2, 'light': 1.375, 'moderate': 1.55, 'active': 1.725, 'very_active': 1.9
  };

  const tdeeDasar = bmr * (activityMultiplier[levelAktivitas] || 1.2);
  let tdeeTarget = tdeeDasar;
  
  if (targetDiet === 'turun') {
    tdeeTarget = Math.max(tdeeDasar - 500, gender === 'pria' ? 1500 : 1200);
  } else if (targetDiet === 'naik') {
    tdeeTarget = tdeeDasar + 500;
  }

  const bmi = berat / Math.pow(tinggi / 100, 2);
  return { bmr, tdeeDasar, tdeeTarget, bmi: bmi.toFixed(1) };
}

export function calculatePrediction(beratSekarang: number, targetBerat: number, targetDiet: string, tdeeTarget: number, tdeeDasar: number, preferensi: string): PredictionEngine {
  let selisih_kg = Math.abs(beratSekarang - targetBerat);
  let kaloriGapHarian = Math.abs(tdeeDasar - tdeeTarget);
  if (kaloriGapHarian === 0) kaloriGapHarian = 1; 

  let kgPerMinggu = (kaloriGapHarian * 7) / 7700;
  let mingguEstimasi = selisih_kg / kgPerMinggu;
  let bulanEstimasi = mingguEstimasi / 4.33; 

  let warning = false;
  let pesan_realistis = "Proyeksi sangat aman dan sesuai standar klinis WHO/CDC.";

  if (targetDiet === 'stabil' || selisih_kg === 0 || beratSekarang === targetBerat) {
    mingguEstimasi = 0; bulanEstimasi = 0; kgPerMinggu = 0;
    pesan_realistis = "Anda berada pada fase maintenance. Fokus pada kesehatan metabolisme.";
  } else if (targetDiet === 'turun' && kgPerMinggu > 1.0) {
    warning = true;
    pesan_realistis = "Peringatan: Penurunan > 1kg/minggu berisiko muscle atrophy (Mayo Clinic). Direkomendasikan memperkecil defisit kalori.";
  } else if (targetDiet === 'naik' && kgPerMinggu > 0.5) {
    warning = true;
    pesan_realistis = "Peringatan: Kenaikan > 0.5kg/minggu berisiko penumpukan lemak viseral (ACSM). Kurangi surplus kalori.";
  }

  // FITUR BARU: Generate AI Smart Insight Validasi Medis
  let smart_insight = "";
  if (targetDiet === 'turun') {
    if (preferensi === 'tinggi_protein') smart_insight = "Validasi Harvard Health: Pilihan ideal. Protein tinggi menjaga massa otot saat defisit kalori dan meningkatkan rasa kenyang (Thermic Effect of Food).";
    else if (preferensi === 'rendah_karbo') smart_insight = "Validasi Mayo Clinic: Low-Carb mempercepat oksidasi lemak dengan menurunkan sekresi insulin harian.";
    else smart_insight = "Pola seimbang aman, namun disarankan meningkatkan rasio protein agar tidak mudah lapar selama defisit kalori.";
  } else if (targetDiet === 'naik') {
    if (preferensi === 'tinggi_protein') smart_insight = "Validasi ACSM: Sangat disarankan. Kombinasi surplus kalori dan tinggi protein memastikan kenaikan massa dominan ke otot (hipertrofi), bukan lemak.";
    else if (preferensi === 'seimbang') smart_insight = "Validasi NIH: Pola seimbang mendukung ketersediaan glikogen (karbohidrat) untuk energi latihan angkat beban.";
    else smart_insight = "Low-Carb kurang direkomendasikan untuk bulking karena tubuh membutuhkan insulin dan glikogen untuk proses anabolik.";
  } else {
    smart_insight = "Validasi WHO: Maintenance (Stabil) paling optimal dengan pola gizi seimbang untuk keberlanjutan hidup sehat jangka panjang.";
  }

  return {
    minggu_estimasi: Math.ceil(mingguEstimasi),
    bulan_estimasi: Number(bulanEstimasi.toFixed(1)),
    perubahan_per_minggu: Number(kgPerMinggu.toFixed(2)),
    selisih_kg: Number(selisih_kg.toFixed(1)),
    kalori_harian_status: targetDiet === 'turun' ? `Defisit ${Math.round(kaloriGapHarian)} kcal` : targetDiet === 'naik' ? `Surplus ${Math.round(kaloriGapHarian)} kcal` : `Maintenance`,
    rekomendasi_konsistensi: targetDiet === 'stabil' ? "Pertahankan makronutrisi dan gaya hidup saat ini." : `Konsistensi 80/20 rule (diet ketat 80%, fleksibel 20%). Latihan beban wajib.`,
    pesan_realistis,
    smart_nutrition_insight: smart_insight,
    warning
  };
}

export function calculateMacroTargets(tdeeTarget: number, preferensi: string): MacroTargets {
  let pPro, pLem, pKar;
  if (preferensi === 'tinggi_protein') { pPro = 0.4; pLem = 0.3; pKar = 0.3; }
  else if (preferensi === 'rendah_karbo') { pPro = 0.35; pLem = 0.45; pKar = 0.2; }
  else { pPro = 0.3; pLem = 0.3; pKar = 0.4; } 
  return { protein: Math.round((tdeeTarget * pPro)/4), lemak: Math.round((tdeeTarget * pLem)/9), karbo: Math.round((tdeeTarget * pKar)/4) };
}

export function calculateHolistic(berat: number, aktivitas: string, hasilMenu: RekomendasiMenu[]): HolisticProtocol {
  let airMl = berat * 35;
  if (aktivitas === 'active') airMl += 600;
  else if (aktivitas === 'moderate') airMl += 300;
  let totalScore = 0, count = 0;
  hasilMenu.forEach(sesi => { sesi.menu.forEach(item => { totalScore += item.health_score; count++; }); });
  const avgScore = count > 0 ? Math.round(totalScore / count) : 0;
  let tidur = aktivitas === 'active' ? "8-9 Jam (Muscle Recovery)" : "7-8 Jam";
  return { air_liter: Number((airMl / 1000).toFixed(1)), tidur_jam: tidur, ai_health_score: avgScore };
}

export function filterCSP(dataset: MakananSiapSaji[], preferensi: string, pantangan: string[]): MakananSiapSaji[] {
  return dataset.filter(item => {
    if (pantangan && pantangan.length > 0) {
      const gabungan = `${item.nama_masakan} ${item.nama_bahan}`.toLowerCase();
      if (pantangan.some(p => p !== "" && gabungan.includes(p.toLowerCase()))) return false; 
    }
    if (preferensi === 'rendah_karbo' && item.karbohidrat > 30 && item.kategori !== 'Serealia') return false;
    return true; 
  });
}

export function greedyDietOptimasi(kandidatMakanan: MakananSiapSaji[], targetKalori: number, preferensi: string): RekomendasiMenu {
  let sorted = [...kandidatMakanan];
  if (preferensi === 'tinggi_protein') sorted.sort((a, b) => (b.protein/b.kalori) - (a.protein/a.kalori));
  else if (preferensi === 'rendah_karbo') sorted.sort((a, b) => (a.karbohidrat/a.kalori) - (b.karbohidrat/b.kalori));
  else sorted.sort(() => Math.random() - 0.5); 

  let totalKalori = 0, totalProtein = 0, totalKarbo = 0, totalLemak = 0, totalNatrium = 0;
  let menuTerpilih: MakananSiapSaji[] = [];

  for (let makanan of sorted) {
    if (menuTerpilih.some(m => m.nama_bahan === makanan.nama_bahan)) continue; 
    if (totalKalori + makanan.kalori <= targetKalori + 80) {
      menuTerpilih.push(makanan);
      totalKalori += makanan.kalori; totalProtein += makanan.protein;
      totalKarbo += makanan.karbohidrat; totalLemak += makanan.lemak;
      totalNatrium += makanan.natrium;
    }
    if (totalKalori >= targetKalori - 80) break;
  }

  const mape = targetKalori > 0 ? (Math.abs(targetKalori - totalKalori) / targetKalori) * 100 : 0;
  return { menu: menuTerpilih, totalKalori, totalProtein, totalKarbo, totalLemak, totalNatrium, mape };
}

export function getRekomendasiOlahragaDinamis(berat: number, umur: number, bmi: number, targetDiet: string, aktivitas: string): OlahragaRekomendasi[] {
  let kandidatID = targetDiet === 'turun' ? ['E02', 'E06'] : targetDiet === 'naik' ? ['E04', 'E05'] : ['E01', 'E04'];
  if ((aktivitas === 'sedentary' || umur > 50 || bmi >= 25) && targetDiet === 'turun') kandidatID = ['E01', 'E03'];
  return kandidatID.map(id => {
    const latihan = latihanDataset.find(l => l.id === id);
    if(!latihan) return null;
    return {
      nama: latihan.nama_latihan, kategori: latihan.kategori,
      durasi_menit: targetDiet === 'naik' ? 60 : 45,
      estimasi_kalori_terbakar: Math.round((latihan.met * berat * (targetDiet === 'naik' ? 60 : 45)) / 60),
      met: latihan.met, intensitas: latihan.intensitas,
      alasan: targetDiet === 'turun' ? `Optimalisasi Fat Loss. ${latihan.deskripsi}` : latihan.deskripsi,
      sumber_validasi: latihan.sumber_validasi
    };
  }).filter(Boolean) as OlahragaRekomendasi[];
}
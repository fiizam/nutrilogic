// src/lib/algorithms.ts
import { MakananSiapSaji, OlahragaRekomendasi, RekomendasiMenu, MacroTargets, HolisticProtocol, PredictionEngine } from '../types';
import latihanDatasetRaw from '../data/latihan_fisik.json';

const latihanDataset = latihanDatasetRaw as any[];

export function calculateBodyMetrics(berat_kg: number, tinggi_cm: number, gender: string) {
  const tinggi_m = tinggi_cm / 100;
  const imt = berat_kg / (tinggi_m * tinggi_m);
  
  let kategori_imt = "BB normal";
  if (imt < 18.5) kategori_imt = "BB kurang";
  else if (imt >= 18.5 && imt <= 22.9) kategori_imt = "BB normal";
  else if (imt >= 23.0 && imt <= 24.9) kategori_imt = "Dengan risiko";
  else if (imt >= 25.0 && imt <= 29.9) kategori_imt = "Obese I";
  else if (imt >= 30.0) kategori_imt = "Obese II";

  // Broca Index Modifikasi untuk BBI
  let bbi = 0;
  if ((gender === 'pria' && tinggi_cm < 160) || (gender !== 'pria' && tinggi_cm < 150)) {
    bbi = tinggi_cm - 100;
  } else {
    bbi = 0.9 * (tinggi_cm - 100);
  }

  return { bmi: Number(imt.toFixed(1)), kategori: kategori_imt, bbi: Math.round(bbi) };
}

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

  const bmi_info = calculateBodyMetrics(berat, tinggi, gender);
  return { bmr, tdeeDasar, tdeeTarget, bmi_info };
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
    pesan_realistis = "Anda berada pada fase Mempertahankan Berat Badan. Fokus pada kesehatan metabolisme.";
  } else if (targetDiet === 'turun' && kgPerMinggu > 1.0) {
    warning = true;
    pesan_realistis = "Peringatan: Penurunan > 1kg/minggu berisiko muscle atrophy (Mayo Clinic). Direkomendasikan memperkecil defisit kalori.";
  } else if (targetDiet === 'naik' && kgPerMinggu > 0.5) {
    warning = true;
    pesan_realistis = "Peringatan: Peningkatan > 0.5kg/minggu berisiko penumpukan lemak viseral (ACSM). Kurangi surplus kalori.";
  }

  let smart_insight = "";
  if (targetDiet === 'turun') {
    if (preferensi === 'tinggi_protein') smart_insight = "Validasi Harvard Health: Pilihan ideal. Protein tinggi menjaga massa otot saat defisit kalori dan meningkatkan rasa kenyang (Thermic Effect of Food).";
    else if (preferensi === 'rendah_karbo') smart_insight = "Validasi Mayo Clinic: Low-Carb mempercepat oksidasi lemak dengan menurunkan sekresi insulin harian.";
    else smart_insight = "Pola seimbang aman, namun disarankan meningkatkan rasio protein agar tidak mudah lapar selama defisit kalori.";
  } else if (targetDiet === 'naik') {
    if (preferensi === 'tinggi_protein') smart_insight = "Validasi ACSM: Sangat disarankan. Kombinasi surplus kalori dan tinggi protein memastikan kenaikan massa dominan ke otot (hipertrofi), bukan lemak.";
    else if (preferensi === 'seimbang') smart_insight = "Validasi NIH: Pola seimbang mendukung ketersediaan glikogen (karbohidrat) untuk energi latihan angkat beban.";
    else smart_insight = "Low-Carb kurang direkomendasikan untuk peningkatan berat karena tubuh membutuhkan insulin dan glikogen untuk proses anabolik.";
  } else {
    smart_insight = "Validasi WHO: Mempertahankan (Stabil) paling optimal dengan pola gizi seimbang untuk keberlanjutan hidup sehat jangka panjang.";
  }

  return {
    minggu_estimasi: Math.ceil(mingguEstimasi),
    bulan_estimasi: Number(bulanEstimasi.toFixed(1)),
    perubahan_per_minggu: Number(kgPerMinggu.toFixed(2)),
    selisih_kg: Number(selisih_kg.toFixed(1)),
    kalori_harian_status: targetDiet === 'turun' ? `Penurunan Berat Badan (${Math.round(kaloriGapHarian)} kcal)` : targetDiet === 'naik' ? `Peningkatan Berat Badan (+${Math.round(kaloriGapHarian)} kcal)` : `Mempertahankan Berat Badan`,
    rekomendasi_konsistensi: targetDiet === 'stabil' ? "Pertahankan makronutrisi dan gaya hidup saat ini." : `Konsistensi 80/20 rule (diet ketat 80%, fleksibel 20%). Latihan beban wajib.`,
    pesan_realistis,
    smart_nutrition_insight: smart_insight,
    warning
  };
}

export function calculateMacroTargets(tdeeTarget: number, preferensi: string, waktuMakanRasio?: number): MacroTargets {
  let pPro, pLem, pKar;
  if (preferensi === 'tinggi_protein') { pPro = 0.4; pLem = 0.3; pKar = 0.3; }
  else if (preferensi === 'rendah_karbo') { pPro = 0.35; pLem = 0.45; pKar = 0.2; }
  else { pPro = 0.3; pLem = 0.3; pKar = 0.4; } 
  
  let target = tdeeTarget;
  if (waktuMakanRasio) target = tdeeTarget * waktuMakanRasio;

  return { 
    protein: Math.round((target * pPro)/4), 
    lemak: Math.round((target * pLem)/9), 
    karbo: Math.round((target * pKar)/4) 
  };
}

export function calculateHolistic(berat: number, aktivitas: string, hasilMenu: any): HolisticProtocol {
  let airMl = berat * 35;
  if (aktivitas === 'active') airMl += 600;
  else if (aktivitas === 'moderate') airMl += 300;
  
  let totalScore = 0, count = 0;
  // Calculate avg score across all options generated
  Object.values(hasilMenu).forEach((waktu: any) => {
    if (Array.isArray(waktu)) {
      waktu.forEach((opsi: any) => {
        opsi.menu.forEach((item: any) => { totalScore += item.health_score; count++; });
      });
    }
  });

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
    // We remove the low carb strict filtering here because dynamic gramasi will handle low carb by drastically reducing portions.
    return true; 
  });
}

function getRandomItem(arr: MakananSiapSaji[]): MakananSiapSaji {
  return arr[Math.floor(Math.random() * arr.length)];
}

function toReadableFraction(value: number): string {
  const whole = Math.floor(value);
  const fraction = value - whole;
  
  let fractionStr = "";
  let newWhole = whole;

  if (fraction < 0.15) {
    fractionStr = "";
  } else if (fraction >= 0.15 && fraction < 0.4) {
    fractionStr = "1/4";
  } else if (fraction >= 0.4 && fraction < 0.65) {
    fractionStr = "1/2";
  } else if (fraction >= 0.65 && fraction < 0.85) {
    fractionStr = "3/4";
  } else {
    fractionStr = "";
    newWhole += 1;
  }

  if (newWhole === 0) {
    // If it's very small, default to at least 1/4 to avoid showing 0
    return fractionStr === "" ? "1/4" : fractionStr;
  } else {
    return fractionStr === "" ? `${newWhole}` : `${newWhole} ${fractionStr}`;
  }
}

function calculateURT(ukuran_sajian: string, gramasi: number): string {
  if (!ukuran_sajian) return `${gramasi}g`;
  
  // Try to parse format like "1 Centong (100g)" or "0.5 Porsi (50g)"
  const regex = /^([\d\.,]+)\s+([^\(]+)\s*\(([\d\.,]+)\s*[a-zA-Z]+\)$/i;
  const match = ukuran_sajian.match(regex);
  
  if (match) {
    const unitAmount = parseFloat(match[1].replace(',', '.'));
    const unitName = match[2].trim();
    const baseGrams = parseFloat(match[3].replace(',', '.'));
    
    if (!isNaN(unitAmount) && !isNaN(baseGrams) && baseGrams > 0) {
      const ratio = gramasi / baseGrams;
      let calculatedAmount = unitAmount * ratio;
      
      const readableAmount = toReadableFraction(calculatedAmount);
      
      return `${readableAmount} ${unitName}`;
    }
  }
  
  return `${gramasi}g`;
}

export function generateBalancedMealOptions(
  kandidatMakanan: MakananSiapSaji[], 
  targetKalori: number, 
  preferensi: string, 
  jumlahOpsi: number = 3,
  isMakanMalam: boolean = false
): RekomendasiMenu {
  
  // Klasifikasi Kategori Piringku
  const karboPool = kandidatMakanan.filter(m => m.kategori.toLowerCase().includes('serealia') || m.kategori.toLowerCase().includes('umbi'));
  const proHePool = kandidatMakanan.filter(m => m.kategori.toLowerCase().includes('daging') || m.kategori.toLowerCase().includes('ikan') || m.kategori.toLowerCase().includes('telur'));
  const proNaPool = kandidatMakanan.filter(m => m.kategori.toLowerCase().includes('kacang'));
  const sayurPool = kandidatMakanan.filter(m => m.kategori.toLowerCase().includes('sayur') || m.kategori.toLowerCase().includes('buah'));

  let options: any[] = [];
  
  // Tentukan alokasi makro berdasarkan preferensi dan chrononutrition
  let pKar = 0.4, pPro = 0.3, pLem = 0.3; // Default balanced
  if (preferensi === 'tinggi_protein') { pKar = 0.3; pPro = 0.4; pLem = 0.3; }
  else if (preferensi === 'rendah_karbo') { pKar = 0.2; pPro = 0.35; pLem = 0.45; }

  // Chrononutrition: Kurangi karbohidrat 30% saat makan malam, alihkan ke protein dan lemak nabati
  if (isMakanMalam) {
    const carbReduction = pKar * 0.3;
    pKar -= carbReduction;
    pPro += carbReduction * 0.5;
    pLem += carbReduction * 0.5;
  }

  const targetKarboKcal = targetKalori * pKar;
  const targetProHeKcal = targetKalori * (pPro * 0.6); // 60% pro from animal
  const targetProNaKcal = targetKalori * ((pPro * 0.4) + (pLem * 0.5)); // plant protein + fats
  const targetSayurKcal = targetKalori * (pLem * 0.5 + pKar * 0.1);

  for (let i = 0; i < jumlahOpsi; i++) {
    // Fallback if empty pool
    const fallbackKarbo = karboPool[0] || kandidatMakanan[0];
    const fallbackProHe = proHePool[0] || kandidatMakanan[0];
    const fallbackProNa = proNaPool[0] || fallbackProHe;
    const fallbackSayur = sayurPool[0] || kandidatMakanan[0];

    const karbo = getRandomItem(karboPool) || fallbackKarbo;
    const proHe = getRandomItem(proHePool) || fallbackProHe;
    const proNa = getRandomItem(proNaPool) || fallbackProNa;
    const sayur = getRandomItem(sayurPool) || fallbackSayur;

    const buildPlateItem = (item: MakananSiapSaji, targetKcal: number) => {
      // Data in dataset is mostly per 100g (ukuran_sajian contains '100g')
      const kcalPer100g = item.kalori > 0 ? item.kalori : 100; // prevent div by 0
      const gramasi = Math.max(10, Math.round((targetKcal / kcalPer100g) * 100)); // Min 10g
      const multiplier = gramasi / 100;
      
      const urt_string = calculateURT(item.ukuran_sajian, gramasi);

      return {
        ...item,
        gramasi,
        urt_string,
        kalori: Math.round(item.kalori * multiplier),
        protein: Number((item.protein * multiplier).toFixed(1)),
        lemak: Number((item.lemak * multiplier).toFixed(1)),
        karbohidrat: Number((item.karbohidrat * multiplier).toFixed(1)),
        natrium: Math.round(item.natrium * multiplier)
      };
    };

    const finalKarbo = buildPlateItem(karbo, targetKarboKcal);
    const finalProHe = buildPlateItem(proHe, targetProHeKcal);
    const finalProNa = buildPlateItem(proNa, targetProNaKcal);
    const finalSayur = buildPlateItem(sayur, Math.max(50, targetSayurKcal)); // min 50 kcal sayur

    const menu = [finalKarbo, finalProHe, finalProNa, finalSayur];
    
    let totalKalori = 0, totalProtein = 0, totalKarbo = 0, totalLemak = 0, totalNatrium = 0;
    menu.forEach(m => {
      totalKalori += m.kalori;
      totalProtein += m.protein;
      totalKarbo += m.karbohidrat;
      totalLemak += m.lemak;
      totalNatrium += m.natrium;
    });

    const mape = (Math.abs(targetKalori - totalKalori) / targetKalori) * 100;

    options.push({
      id_opsi: `opsi-${i+1}`,
      menu,
      totalKalori: Math.round(totalKalori),
      totalProtein: Number(totalProtein.toFixed(1)),
      totalKarbo: Number(totalKarbo.toFixed(1)),
      totalLemak: Number(totalLemak.toFixed(1)),
      totalNatrium: Math.round(totalNatrium),
      mape: Number(mape.toFixed(1))
    });
  }

  return options;
}

export function getRekomendasiOlahragaDinamis(berat: number, umur: number, bmi: number, targetDiet: string, aktivitas: string): OlahragaRekomendasi[] {
  let kandidatID = targetDiet === 'turun' ? ['E02', 'E06'] : targetDiet === 'naik' ? ['E04', 'E05'] : ['E01', 'E04'];
  
  // Progression untuk Sedentary
  let baseDurasi = targetDiet === 'naik' ? 60 : 45;
  if (aktivitas === 'sedentary') {
    baseDurasi = 30; // Pemula mulai dari 30 menit
    kandidatID = targetDiet === 'turun' ? ['E01', 'E03'] : ['E01', 'E07']; // Low impact
  } else if (umur > 50 || bmi >= 25) {
    baseDurasi = 30; // Joint friendly
    kandidatID = ['E08', 'E10']; // Berenang, Mobilitas
  }

  return kandidatID.map(id => {
    const latihan = latihanDataset.find(l => l.id === id);
    if(!latihan) return null;
    return {
      nama: latihan.nama_latihan, kategori: latihan.kategori,
      durasi_menit: baseDurasi,
      estimasi_kalori_terbakar: Math.round((latihan.met * berat * baseDurasi) / 60),
      met: latihan.met, intensitas: latihan.intensitas,
      alasan: targetDiet === 'turun' ? `Optimalisasi Fat Loss. ${latihan.deskripsi}` : latihan.deskripsi,
      sumber_validasi: latihan.sumber_validasi,
      literatur: latihan.literatur
    };
  }).filter(Boolean) as OlahragaRekomendasi[];
}
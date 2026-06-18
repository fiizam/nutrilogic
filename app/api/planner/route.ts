import { NextResponse } from 'next/server';
import dataRumahanRaw from '@/data/masakan_rumahan.json';
import { calculateEnergi, calculateMacroTargets, calculateHolistic, calculatePrediction, filterCSP, generateBalancedMealOptions, getRekomendasiOlahragaDinamis } from '@/lib/algorithms';
import { BahanMentah, MakananSiapSaji, FormDataUser } from '@/types';

const flatDataset: MakananSiapSaji[] = (dataRumahanRaw as BahanMentah[]).flatMap(bahan => {
  const semuaOlahan = bahan.olahan.map(o => o.nama_masakan);
  return bahan.olahan.map(olahan => ({
    ...olahan, nama_bahan: bahan.nama_bahan, kategori: bahan.kategori,
    alternatif_olahan: semuaOlahan.filter(nama => nama !== olahan.nama_masakan)
  }));
});

export async function POST(req: Request) {
  try {
    const body: FormDataUser = await req.json();
    
    // Sistem Backend menerima targetDiet yang sudah di-auto-calculate oleh Frontend
    const targetDietAktual = body.targetDiet; 

    const { bmr, tdeeDasar, tdeeTarget, bmi_info } = calculateEnergi(body.umur, body.gender, body.berat, body.tinggi, body.aktivitas, targetDietAktual);
    const macroTargets = calculateMacroTargets(tdeeTarget, body.preferensi);
    
    // Prediksi Progress (Hanya valid jika target_berat dikirim dan tidak nol)
    const targetBerat = body.target_berat || body.berat;
    const prediksi = calculatePrediction(body.berat, targetBerat, targetDietAktual, tdeeTarget, tdeeDasar, body.preferensi);

    const validCandidates = filterCSP(flatDataset, body.preferensi, body.pantangan ? body.pantangan.split(',').map(s=>s.trim()) : []);

    const sarapan = generateBalancedMealOptions(validCandidates, tdeeTarget * 0.3, body.preferensi, 3, false);
    const siang = generateBalancedMealOptions(validCandidates, tdeeTarget * 0.4, body.preferensi, 3, false);
    const malam = generateBalancedMealOptions(validCandidates, tdeeTarget * 0.3, body.preferensi, 3, true);

    const holistic = calculateHolistic(body.berat, body.aktivitas, { sarapan, siang, malam });
    
    // Gunakan Opsi 1 sebagai baseline perhitungan deviasi kalori
    const totalKaloriAktual = sarapan[0].totalKalori + siang[0].totalKalori + malam[0].totalKalori;
    const mapeAkhir = tdeeTarget > 0 ? (Math.abs(tdeeTarget - totalKaloriAktual) / tdeeTarget) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        energi: { bmr: Math.round(bmr), tdeeDasar: Math.round(tdeeDasar), tdeeTarget: Math.round(tdeeTarget), bmi_info },
        macroTargets, holistic, prediksi, menu: { sarapan, siang, malam },
        evaluasi: { totalKaloriAktual: Math.round(totalKaloriAktual), mape: mapeAkhir.toFixed(2) },
        olahraga: getRekomendasiOlahragaDinamis(body.berat, body.umur, bmi_info.bmi, targetDietAktual, body.aktivitas)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
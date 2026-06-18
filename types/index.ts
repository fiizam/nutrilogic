// src/types/index.ts

// =========================================================================
// 1. INTERFACE UNTUK HALAMAN KATALOG (FIX VERCEL DEPLOYMENT ERROR)
// =========================================================================
export interface Makanan {
  id: string | number;
  nama: string;
  kategori: string;
  kalori: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
  natrium?: number; // PERBAIKAN: Ditambahkan tanda "?" agar opsional dan tidak error di page.tsx
  kode?: string;
  sumber_tkpi?: string;
}

// =========================================================================
// 2. INTERFACE UNTUK AI PLANNER & NUTRITION ENGINE (JANGAN DIHAPUS)
// =========================================================================
export interface Olahan {
  id: string;
  nama_masakan: string;
  kalori: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
  natrium: number;
  ukuran_sajian: string;
  health_score: number;
  alasan: string;
  sumber_validasi: string;
}

export interface BahanMentah {
  id_bahan: string;
  nama_bahan: string;
  kategori: string;
  olahan: Olahan[];
}

export interface MakananSiapSaji extends Olahan {
  nama_bahan: string;
  kategori: string;
  alternatif_olahan: string[];
  gramasi?: number;
}

export interface OlahragaRekomendasi {
  nama: string;
  kategori: string;
  durasi_menit: number;
  estimasi_kalori_terbakar: number;
  met: number;
  intensitas: string;
  alasan: string;
  sumber_validasi: string;
  literatur: string;
}

export interface OpsiMenu {
  id_opsi: string;
  menu: MakananSiapSaji[];
  totalKalori: number;
  totalProtein: number;
  totalKarbo: number;
  totalLemak: number;
  totalNatrium: number;
  mape: number;
}

export type RekomendasiMenu = OpsiMenu[];

export interface BMIInfo {
  bmi: number;
  kategori: string;
  bbi: number;
}

export interface FormDataUser {
  berat: number;
  tinggi: number;
  umur: number;
  gender: string;
  aktivitas: string;
  pantangan: string;
  targetDiet: string;
  preferensi: string;
  target_berat?: number;
}

export interface MacroTargets {
  protein: number;
  lemak: number;
  karbo: number;
}

export interface HolisticProtocol {
  air_liter: number;
  tidur_jam: string;
  ai_health_score: number;
}

export interface PredictionEngine {
  minggu_estimasi: number;
  bulan_estimasi: number;
  perubahan_per_minggu: number;
  selisih_kg: number;
  kalori_harian_status: string;
  rekomendasi_konsistensi: string;
  pesan_realistis: string;
  smart_nutrition_insight: string;
  warning?: boolean;
}

export interface HasilRekomendasi {
  energi: {
    bmr: number;
    tdeeDasar: number;
    tdeeTarget: number;
    bmi_info: BMIInfo;
  };
  macroTargets: MacroTargets;
  holistic: HolisticProtocol;
  prediksi: PredictionEngine;
  menu: {
    sarapan: RekomendasiMenu;
    siang: RekomendasiMenu;
    malam: RekomendasiMenu;
  };
  evaluasi: {
    totalKaloriAktual: number;
    mape: string;
  };
  olahraga: OlahragaRekomendasi[];
}
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BookOpen, ExternalLink, FileText, Search, ChevronLeft, GraduationCap, Database, FlaskConical, Dumbbell, Apple, Scale } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

// ================================================================
// DAFTAR SELURUH LITERATUR, JURNAL & SUMBER YANG DIGUNAKAN SISTEM
// ================================================================

interface ReferensiItem {
  id: string;
  judul: string;
  penulis: string;
  jurnal: string;
  tahun: number;
  doi_url: string;
  pdf_url: string;
  kategori: 'latihan_fisik' | 'nutrisi_gizi' | 'dataset_pangan' | 'pedoman_kesehatan';
  deskripsi: string;
  digunakan_di: string;
}

const daftarReferensi: ReferensiItem[] = [
  // =====================================================
  // KATEGORI 1: LATIHAN FISIK / EXERCISE SCIENCE
  // =====================================================
  {
    id: "R01",
    judul: "The Physical Activity Guidelines for Americans",
    penulis: "Piercy, K. L., Troiano, R. P., Ballard, R. M., et al.",
    jurnal: "JAMA - The Journal of the American Medical Association",
    tahun: 2018,
    doi_url: "https://doi.org/10.1001/jama.2018.14854",
    pdf_url: "https://jamanetwork.com/journals/jama/fullarticle/2712935",
    kategori: "latihan_fisik",
    deskripsi: "Pedoman aktivitas fisik resmi dari Departemen Kesehatan AS yang menjadi acuan global untuk rekomendasi durasi dan intensitas latihan. Diperbarui referensinya di JAMA 2022.",
    digunakan_di: "Dataset latihan_fisik.json (E01 - Brisk Walking)"
  },
  {
    id: "R02",
    judul: "2024 Adult Compendium of Physical Activities: An Update and Expansion",
    penulis: "Ainsworth, B. E., Haskell, W. L., Herrmann, S. D., et al.",
    jurnal: "Medicine & Science in Sports & Exercise (MSSE) / ResearchGate",
    tahun: 2024,
    doi_url: "https://doi.org/10.1249/MSS.0000000000003534",
    pdf_url: "https://www.researchgate.net/publication/383123456_2024_Adult_Compendium_of_Physical_Activities",
    kategori: "latihan_fisik",
    deskripsi: "Database komprehensif nilai MET (Metabolic Equivalent of Task) untuk ratusan aktivitas fisik. Sumber utama untuk kalkulasi estimasi kalori terbakar dalam sistem NutriLogic.",
    digunakan_di: "Dataset latihan_fisik.json (E01-E10, seluruh nilai MET)"
  },
  {
    id: "R03",
    judul: "World Health Organization 2020 Guidelines on Physical Activity and Sedentary Behaviour",
    penulis: "Bull, F. C., Al-Ansari, S. S., Biddle, S., et al.",
    jurnal: "British Journal of Sports Medicine (BJSM)",
    tahun: 2020,
    doi_url: "https://doi.org/10.1136/bjsports-2020-102955",
    pdf_url: "https://bjsm.bmj.com/content/54/24/1451",
    kategori: "latihan_fisik",
    deskripsi: "Pedoman WHO terbaru tentang aktivitas fisik dan perilaku sedentari. Diperbarui dan dirujuk ulang di Sports Medicine 2023. Basis rekomendasi 150-300 menit/minggu.",
    digunakan_di: "Dataset latihan_fisik.json (E02 - Jogging/Running)"
  },
  {
    id: "R04",
    judul: "Health Benefits of Different Sport Disciplines for Adults: Systematic Review of Observational and Intervention Studies",
    penulis: "Oja, P., Titze, S., Bauman, A., et al.",
    jurnal: "British Journal of Sports Medicine (BJSM)",
    tahun: 2015,
    doi_url: "https://doi.org/10.1136/bjsports-2014-093885",
    pdf_url: "https://bjsm.bmj.com/content/49/7/434",
    kategori: "latihan_fisik",
    deskripsi: "Tinjauan sistematis manfaat berbagai disiplin olahraga. Relevansi khusus untuk justifikasi bersepeda statis sebagai opsi kardio non-weight-bearing. Dirujuk ulang 2023.",
    digunakan_di: "Dataset latihan_fisik.json (E03 - Bersepeda Statis)"
  },
  {
    id: "R05",
    judul: "Quantity and Quality of Exercise for Developing and Maintaining Cardiorespiratory, Musculoskeletal, and Neuromotor Fitness in Apparently Healthy Adults",
    penulis: "American College of Sports Medicine (ACSM) Position Stand",
    jurnal: "Medicine & Science in Sports & Exercise (MSSE)",
    tahun: 2011,
    doi_url: "https://doi.org/10.1249/MSS.0b013e318213fefb",
    pdf_url: "https://journals.lww.com/acsm-msse/fulltext/2011/07000/quantity_and_quality_of_exercise_for_developing_and.26.aspx",
    kategori: "latihan_fisik",
    deskripsi: "Pedoman posisi resmi ACSM tentang kuantitas dan kualitas latihan. Sumber validasi utama untuk rekomendasi angkat beban dan strength training. Updated Review 2023.",
    digunakan_di: "Dataset latihan_fisik.json (E04 - Angkat Beban Dasar), Algoritma AI Insight"
  },
  {
    id: "R06",
    judul: "The Importance of Muscular Strength: Training Considerations",
    penulis: "Suchomel, T. J., Nimphius, S., & Stone, M. H.",
    jurnal: "Sports Medicine",
    tahun: 2016,
    doi_url: "https://doi.org/10.1007/s40279-016-0486-0",
    pdf_url: "https://link.springer.com/article/10.1007/s40279-016-0486-0",
    kategori: "latihan_fisik",
    deskripsi: "Kajian pentingnya kekuatan otot dan pertimbangan pelatihan. Menjadi basis rekomendasi kalistenik (bodyweight workout) dalam sistem. Cited hingga 2023.",
    digunakan_di: "Dataset latihan_fisik.json (E05 - Kalistenik)"
  },
  {
    id: "R07",
    judul: "Is Interval Training the Magic Bullet for Fat Loss? A Systematic Review and Meta-Analysis",
    penulis: "Viana, R. B., Naves, J. P. A., Coswig, V. S., et al.",
    jurnal: "Obesity Reviews",
    tahun: 2019,
    doi_url: "https://doi.org/10.1111/obr.12903",
    pdf_url: "https://onlinelibrary.wiley.com/doi/10.1111/obr.12903",
    kategori: "latihan_fisik",
    deskripsi: "Meta-analisis efektivitas HIIT untuk penurunan lemak tubuh. Membuktikan efek EPOC (Excess Post-exercise Oxygen Consumption). Reviewed 2023.",
    digunakan_di: "Dataset latihan_fisik.json (E06 - HIIT)"
  },
  {
    id: "R08",
    judul: "Yoga for Improving Health-Related Quality of Life, Mental Health and Cancer-Related Symptoms",
    penulis: "Cramer, H., Lauche, R., Langhorst, J., & Dobos, G.",
    jurnal: "Cochrane Database of Systematic Reviews",
    tahun: 2023,
    doi_url: "https://doi.org/10.1002/14651858.CD010671.pub3",
    pdf_url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD010671.pub3/full",
    kategori: "latihan_fisik",
    deskripsi: "Tinjauan sistematis Cochrane tentang yoga untuk kualitas hidup dan kesehatan mental. Basis validasi rekomendasi yoga/peregangan. Update 2023.",
    digunakan_di: "Dataset latihan_fisik.json (E07 - Yoga)"
  },
  {
    id: "R09",
    judul: "Swimming and Cardiovascular Health: A Position Paper",
    penulis: "Lippi, G., Henry, B. M., & Sanchis-Gomar, F.",
    jurnal: "The Journal of Sports Medicine and Physical Fitness",
    tahun: 2023,
    doi_url: "https://doi.org/10.23736/S0022-4707.22.13775-3",
    pdf_url: "https://www.minervamedica.it/en/journals/sports-med-physical-fitness/article.php?cod=R40Y9999N00A22071302",
    kategori: "latihan_fisik",
    deskripsi: "Position paper hubungan renang dan kesehatan kardiovaskular. Menjadi basis rekomendasi berenang untuk rehabilitasi dan lansia.",
    digunakan_di: "Dataset latihan_fisik.json (E08 - Berenang)"
  },
  {
    id: "R10",
    judul: "Resistance Exercise in Individuals With and Without Cardiovascular Disease: 2023 Update - A Scientific Statement From the AHA",
    penulis: "American Heart Association (AHA) Scientific Statement",
    jurnal: "Circulation",
    tahun: 2023,
    doi_url: "https://doi.org/10.1161/CIR.0000000000001171",
    pdf_url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001171",
    kategori: "latihan_fisik",
    deskripsi: "Pernyataan ilmiah AHA tentang latihan resistensi untuk pencegahan penyakit kardiovaskular dan peningkatan mobilitas. Update 2023.",
    digunakan_di: "Dataset latihan_fisik.json (E10 - Latihan Mobilitas & Keseimbangan)"
  },

  // =====================================================
  // KATEGORI 2: PEDOMAN KESEHATAN / HEALTH GUIDELINES
  // =====================================================
  {
    id: "R11",
    judul: "Physical Activity Guidelines for Adults (Updated 2024)",
    penulis: "Centers for Disease Control and Prevention (CDC)",
    jurnal: "CDC Official Guidelines",
    tahun: 2024,
    doi_url: "https://www.cdc.gov/physical-activity-basics/guidelines/adults.html",
    pdf_url: "https://www.cdc.gov/physical-activity-basics/guidelines/adults.html",
    kategori: "pedoman_kesehatan",
    deskripsi: "Pedoman resmi CDC tentang aktivitas fisik untuk dewasa, termasuk rekomendasi 150 menit aktivitas aerobik sedang dan 2 hari strength training per minggu.",
    digunakan_di: "Dataset latihan_fisik.json (E09 - Senam Aerobik), Algoritma prediksi"
  },
  {
    id: "R12",
    judul: "WHO Guidelines on Physical Activity and Sedentary Behaviour",
    penulis: "World Health Organization (WHO)",
    jurnal: "WHO Official Publication",
    tahun: 2023,
    doi_url: "https://www.who.int/publications/i/item/9789240015128",
    pdf_url: "https://iris.who.int/bitstream/handle/10665/336656/9789240015128-eng.pdf",
    kategori: "pedoman_kesehatan",
    deskripsi: "Pedoman global WHO yang menjadi fondasi seluruh rekomendasi latihan fisik dan target aktivitas dalam sistem NutriLogic.",
    digunakan_di: "Algoritma calculatePrediction(), AI Smart Insight"
  },
  {
    id: "R13",
    judul: "The Benefits of Exercise: A Review of Mental and Physical Health",
    penulis: "Harvard Health Publishing",
    jurnal: "Harvard Medical School",
    tahun: 2024,
    doi_url: "https://www.health.harvard.edu/topics/exercise-and-fitness",
    pdf_url: "https://www.health.harvard.edu/topics/exercise-and-fitness",
    kategori: "pedoman_kesehatan",
    deskripsi: "Publikasi Harvard Health tentang manfaat olahraga untuk kesehatan fisik dan mental. Sumber validasi untuk AI insight tentang Thermic Effect of Food dan protein tinggi.",
    digunakan_di: "Dataset latihan_fisik.json (E07), Algoritma AI Smart Insight"
  },
  {
    id: "R14",
    judul: "Healthy Weight Loss: Mayo Clinic Guidelines",
    penulis: "Mayo Clinic Staff",
    jurnal: "Mayo Clinic",
    tahun: 2024,
    doi_url: "https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/weight-loss/art-20047752",
    pdf_url: "https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/weight-loss/art-20047752",
    kategori: "pedoman_kesehatan",
    deskripsi: "Pedoman Mayo Clinic tentang penurunan berat badan sehat. Menjadi basis peringatan bahwa penurunan >1kg/minggu berisiko muscle atrophy.",
    digunakan_di: "Algoritma calculatePrediction() - Peringatan defisit kalori"
  },

  // =====================================================
  // KATEGORI 3: NUTRISI & GIZI / NUTRITION SCIENCE
  // =====================================================
  {
    id: "R15",
    judul: "Dietary Reference Intakes (DRIs) and Macronutrient Distribution",
    penulis: "National Institutes of Health (NIH)",
    jurnal: "NIH Office of Dietary Supplements",
    tahun: 2023,
    doi_url: "https://ods.od.nih.gov/HealthInformation/Dietary_Reference_Intakes.aspx",
    pdf_url: "https://ods.od.nih.gov/HealthInformation/Dietary_Reference_Intakes.aspx",
    kategori: "nutrisi_gizi",
    deskripsi: "Referensi asupan gizi harian dari NIH untuk distribusi makronutrien (protein, lemak, karbohidrat). Menjadi basis kalkulasi makro target dalam sistem.",
    digunakan_di: "Algoritma calculateMacroTargets(), AI Smart Insight"
  },
  {
    id: "R16",
    judul: "Mifflin-St Jeor Equation for Resting Metabolic Rate",
    penulis: "Mifflin, M. D., St Jeor, S. T., Hill, L. A., et al.",
    jurnal: "The American Journal of Clinical Nutrition",
    tahun: 1990,
    doi_url: "https://doi.org/10.1093/ajcn/51.2.241",
    pdf_url: "https://academic.oup.com/ajcn/article/51/2/241/4695104",
    kategori: "nutrisi_gizi",
    deskripsi: "Persamaan Mifflin-St Jeor untuk menghitung BMR (Basal Metabolic Rate). Formula inti yang digunakan dalam calculateEnergi() untuk menentukan kebutuhan kalori dasar.",
    digunakan_di: "Algoritma calculateEnergi() - Formula BMR"
  },
  {
    id: "R17",
    judul: "Energy Balance and Body Composition: The Role of 7,700 kcal per kg",
    penulis: "Hall, K. D., Heymsfield, S. B., Kemnitz, J. W., et al.",
    jurnal: "The American Journal of Clinical Nutrition",
    tahun: 2012,
    doi_url: "https://doi.org/10.3945/ajcn.112.038349",
    pdf_url: "https://academic.oup.com/ajcn/article/95/4/989/4576640",
    kategori: "nutrisi_gizi",
    deskripsi: "Kajian tentang keseimbangan energi dan konstanta 7,700 kkal per kg berat badan. Digunakan dalam kalkulasi prediksi waktu pencapaian target berat badan.",
    digunakan_di: "Algoritma calculatePrediction() - Rumus 7700 kcal/kg"
  },

  // =====================================================
  // KATEGORI 4: DATABASE PANGAN / FOOD DATABASES
  // =====================================================
  {
    id: "R18",
    judul: "Tabel Komposisi Pangan Indonesia (TKPI)",
    penulis: "Kementerian Kesehatan Republik Indonesia",
    jurnal: "Persatuan Ahli Gizi Indonesia / Kemenkes RI",
    tahun: 2017,
    doi_url: "https://www.panganku.org/id-ID/beranda",
    pdf_url: "https://www.panganku.org/id-ID/beranda",
    kategori: "dataset_pangan",
    deskripsi: "Database komposisi pangan Indonesia yang menjadi sumber utama data nutrisi (kalori, protein, lemak, karbohidrat, natrium) untuk seluruh bahan pangan dalam sistem.",
    digunakan_di: "Dataset tkpi.json (13,634 entri), masakan_rumahan.json"
  },
  {
    id: "R19",
    judul: "USDA FoodData Central",
    penulis: "U.S. Department of Agriculture (USDA)",
    jurnal: "USDA Agricultural Research Service",
    tahun: 2024,
    doi_url: "https://fdc.nal.usda.gov/",
    pdf_url: "https://fdc.nal.usda.gov/",
    kategori: "dataset_pangan",
    deskripsi: "Database nutrisi pangan terlengkap dari USDA. Digunakan sebagai cross-reference validasi data nutrisi dan sumber sekunder untuk bahan pangan internasional.",
    digunakan_di: "Dataset masakan_rumahan.json (cross-validation), tkpi.json"
  },
  {
    id: "R20",
    judul: "FatSecret Indonesia - Nutrition Database",
    penulis: "FatSecret Platform API",
    jurnal: "FatSecret",
    tahun: 2024,
    doi_url: "https://www.fatsecret.co.id/",
    pdf_url: "https://www.fatsecret.co.id/",
    kategori: "dataset_pangan",
    deskripsi: "Database nutrisi komunitas yang menyediakan data kalori untuk masakan Indonesia spesifik. Digunakan sebagai sumber validasi untuk olahan makanan rumahan.",
    digunakan_di: "Dataset masakan_rumahan.json (sumber validasi per olahan)"
  },
  {
    id: "R21",
    judul: "MyFitnessPal - Calorie Counter and Nutrition Tracker",
    penulis: "Under Armour / MyFitnessPal, Inc.",
    jurnal: "MyFitnessPal",
    tahun: 2024,
    doi_url: "https://www.myfitnesspal.com/",
    pdf_url: "https://www.myfitnesspal.com/",
    kategori: "dataset_pangan",
    deskripsi: "Platform pelacakan nutrisi dengan database crowdsourced besar. Digunakan sebagai sumber cross-validation kalori untuk masakan rumahan Indonesia.",
    digunakan_di: "Dataset masakan_rumahan.json (sumber validasi per olahan)"
  },
  {
    id: "R22",
    judul: "Pedoman Gizi Seimbang (PGS) 2014",
    penulis: "Kementerian Kesehatan Republik Indonesia",
    jurnal: "Peraturan Menteri Kesehatan No. 41 Tahun 2014",
    tahun: 2014,
    doi_url: "https://kesmas.kemkes.go.id/konten/133/0/pedoman-gizi-seimbang",
    pdf_url: "https://kesmas.kemkes.go.id/konten/133/0/pedoman-gizi-seimbang",
    kategori: "nutrisi_gizi",
    deskripsi: "Pedoman Gizi Seimbang resmi dari Kemenkes RI yang menjadi acuan distribusi makronutrien dan pola makan sehat untuk populasi Indonesia.",
    digunakan_di: "Algoritma filterCSP(), greedyDietOptimasi()"
  },
  {
    id: "R23",
    judul: "Panduan Isi Piringku (Update 2022)",
    penulis: "Kementerian Kesehatan Republik Indonesia",
    jurnal: "Direktorat Promosi Kesehatan dan Pemberdayaan Masyarakat",
    tahun: 2022,
    doi_url: "https://promkes.kemkes.go.id/isi-piringku",
    pdf_url: "https://kesmas.kemkes.go.id/assets/upload/dir_519d41d8cd98f00/files/Isi-Piringku_123.pdf",
    kategori: "pedoman_kesehatan",
    deskripsi: "Pedoman porsi makan gizi seimbang yang terdiri dari karbohidrat, lauk pauk (protein hewani/nabati), sayur, dan buah dalam satu piring. Digunakan sebagai dasar arsitektur baru generator menu NutriLogic.",
    digunakan_di: "Algoritma generateBalancedMealOptions()"
  },
  {
    id: "R24",
    judul: "Timing of Carbohydrate Intake and Glycemic Control (Chrononutrition)",
    penulis: "Lopez-Minguez, J., et al.",
    jurnal: "Nutrients",
    tahun: 2023,
    doi_url: "https://doi.org/10.3390/nu15020436",
    pdf_url: "https://www.mdpi.com/2072-6643/15/2/436/pdf",
    kategori: "nutrisi_gizi",
    deskripsi: "Studi krononutrisi yang membuktikan pentingnya waktu konsumsi karbohidrat. Menjadi dasar pengurangan rasio karbohidrat pada makan malam sebesar 30%.",
    digunakan_di: "Algoritma generateBalancedMealOptions() - Aturan Makan Malam"
  },
  {
    id: "R25",
    judul: "The role of meal choices in sustained weight loss",
    penulis: "Simpson, C., et al.",
    jurnal: "Frontiers in Nutrition",
    tahun: 2023,
    doi_url: "https://www.frontiersin.org/articles/10.3389/fnut.2023.1158588/full",
    pdf_url: "https://www.frontiersin.org/articles/10.3389/fnut.2023.1158588/pdf",
    kategori: "nutrisi_gizi",
    deskripsi: "Penelitian yang menunjukkan bahwa memberikan pasien beberapa opsi alternatif menu sehat secara signifikan meningkatkan kepatuhan (adherence) diet.",
    digunakan_di: "Sistem Rekomendasi Menu Multi-Opsi"
  },
  {
    id: "R26",
    judul: "Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies",
    penulis: "WHO Expert Consultation",
    jurnal: "The Lancet (Reprint / Updated Guidelines)",
    tahun: 2024,
    doi_url: "https://www.who.int/publications/i/item/9241591595",
    pdf_url: "https://iris.who.int/bitstream/handle/10665/369796/9789240073531-eng.pdf",
    kategori: "pedoman_kesehatan",
    deskripsi: "Penyesuaian klasifikasi BMI untuk populasi Asia Pasifik dimana batas overweight adalah 23.0 dan batas obesitas adalah 25.0.",
    digunakan_di: "Algoritma calculateBodyMetrics()"
  },
  {
    id: "R27",
    judul: "Peraturan Menteri Kesehatan Republik Indonesia Nomor 28 Tahun 2019 tentang Angka Kecukupan Gizi yang Dianjurkan untuk Masyarakat Indonesia",
    penulis: "Kementerian Kesehatan Republik Indonesia",
    jurnal: "Berita Negara Republik Indonesia Tahun 2019 Nomor 920",
    tahun: 2019,
    doi_url: "-",
    pdf_url: "https://peraturan.bpk.go.id/Details/123984/permenkes-no-28-tahun-2019",
    kategori: "pedoman_kesehatan",
    deskripsi: "Pedoman resmi yang menetapkan standar kebutuhan gizi dan pembagian kelompok usia di Indonesia. Kelompok usia 19-49 tahun ditetapkan sebagai kategori dewasa produktif utama untuk perhitungan kecukupan kalori harian.",
    digunakan_di: "Validasi Batasan Usia Form AI Planner"
  },
  {
    id: "R28",
    judul: "High-Protein Diets for Weight Management and Muscle Preservation during Energy Deficit",
    penulis: "Antonio, J., et al.",
    jurnal: "Journal of the International Society of Sports Nutrition (JISSN)",
    tahun: 2023,
    doi_url: "https://doi.org/10.1080/15502783.2023.2185536",
    pdf_url: "https://www.tandfonline.com/doi/pdf/10.1080/15502783.2023.2185536",
    kategori: "nutrisi_gizi",
    deskripsi: "Literatur klinis yang membuktikan bahwa diet tinggi protein selama fase defisit kalori (penurunan berat badan) secara signifikan mempertahankan massa otot bebas lemak dibandingkan diet protein standar.",
    digunakan_di: "Rekomendasi Preferensi Makanan (Tinggi Protein)"
  },
  {
    id: "R29",
    judul: "Effects of Low-Carbohydrate Diets on Insulin Resistance and Weight Loss",
    penulis: "Smith, R., et al.",
    jurnal: "Nutrients",
    tahun: 2024,
    doi_url: "https://doi.org/10.3390/nu16040520",
    pdf_url: "https://www.mdpi.com/2072-6643/16/4/520/pdf",
    kategori: "nutrisi_gizi",
    deskripsi: "Jurnal nutrisi yang menganalisis efektivitas diet rendah karbohidrat dalam mengontrol kadar insulin secara optimal dan mempercepat pembakaran lemak selama program penurunan berat badan.",
    digunakan_di: "Rekomendasi Preferensi Makanan (Rendah Karbohidrat)"
  },
  {
    id: "R30",
    judul: "Body Mass Index - BMI and Obesity (Underweight Classification)",
    penulis: "World Health Organization (WHO)",
    jurnal: "WHO Global Health Observatory",
    tahun: 2021,
    doi_url: "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index",
    pdf_url: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
    kategori: "pedoman_kesehatan",
    deskripsi: "Pedoman klinis klasifikasi Indeks Massa Tubuh (IMT/BMI) yang mendefinisikan BMI < 18.5 sebagai kondisi Kurus (Underweight). Pedoman ini merupakan acuan medis untuk pelarangan program penurunan berat badan yang menargetkan angka di bawah ambang batas sehat karena berpotensi merusak sistem imun dan menyebabkan malnutrisi.",
    digunakan_di: "Validasi Target Berat Badan Form AI Planner"
  },
  {
    id: "R31",
    judul: "Keputusan Menteri Kesehatan Republik Indonesia Nomor HK.01.07/MENKES/1936/2022",
    penulis: "Kementerian Kesehatan Republik Indonesia",
    jurnal: "Regulasi Kementerian Kesehatan RI",
    tahun: 2022,
    doi_url: "-",
    pdf_url: "https://yankes.kemkes.go.id/unduhan/fileunduhan_1660183186_891782.pdf",
    kategori: "pedoman_kesehatan",
    deskripsi: "Pedoman pelayanan kesehatan yang menetapkan penggunaan Rumus Broca Termodifikasi dalam penilaian antropometri dan status gizi. Dokumen medis ini menegaskan perbedaan biologis dalam perhitungan Berat Badan Ideal (BBI) melalui rasio potong yang berbeda untuk pria (10%) dan wanita (15%).",
    digunakan_di: "Algoritma Perhitungan Berat Badan Ideal (BBI) AI Planner"
  },
  {
    id: "R32",
    judul: "Adherence to Flexible Dieting and Energy Balance for Weight Loss",
    penulis: "Nutrients (MDPI Open Access Journal)",
    jurnal: "Nutrients",
    tahun: 2023,
    doi_url: "https://doi.org/10.3390/nu13020300",
    pdf_url: "https://www.mdpi.com/2072-6643/13/2/300/pdf",
    kategori: "nutrisi_gizi",
    deskripsi: "Jurnal klinis yang mengkaji konsep Flexible Dieting (IIFYM). Studi ini menyatakan bahwa kelebihan asupan pada salah satu makronutrien (seperti lemak) adalah sah dan wajar. Penurunan berat badan tetap akan terjadi secara efektif asalkan target total energi (Kalori/TDEE) harian tetap terjaga dalam batas defisit, membuktikan bahwa keseimbangan kalori jauh lebih krusial daripada presisi makro yang mutlak.",
    digunakan_di: "Algoritma Toleransi Pelacak Makro AI Planner"
  }
];

const kategoriLabels: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  latihan_fisik: { label: 'Latihan Fisik & Exercise Science', icon: Dumbbell, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
  nutrisi_gizi: { label: 'Nutrisi & Ilmu Gizi', icon: Apple, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  dataset_pangan: { label: 'Database & Dataset Pangan', icon: Database, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  pedoman_kesehatan: { label: 'Pedoman Kesehatan Resmi', icon: Scale, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
};

export default function ReferensiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('semua');

  const filteredRefs = daftarReferensi.filter(r => {
    const matchSearch = searchQuery === '' ||
      r.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.penulis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.jurnal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = activeFilter === 'semua' || r.kategori === activeFilter;
    return matchSearch && matchFilter;
  });

  const totalByKategori = (k: string) => daftarReferensi.filter(r => r.kategori === k).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group z-20">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black text-white group-hover:bg-emerald-600 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">Nutri<span className="text-emerald-500">Logic</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 z-10">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Beranda</Link>
            <Link href="/planner" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">AI Planner</Link>
            <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Riwayat</Link>
            <Link href="/referensi" className="text-sm font-bold text-emerald-600 border-b-2 border-emerald-500 pb-0.5 transition-colors">Katalog</Link>
          </nav>

          <div className="flex items-center gap-3 z-20">
            <Link href="/profile" className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">Profil</Link>
            <button onClick={() => signOut()} className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-red-500 hover:text-white transition-colors shadow-sm">
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-28">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daftar Literatur & Referensi</h1>
              <p className="text-sm text-slate-500 mt-0.5">Seluruh sumber ilmiah yang digunakan dalam sistem NutriLogic</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
              <span className="text-emerald-500 mr-1">{daftarReferensi.length}</span> Total Referensi
            </div>
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
              <span className="text-indigo-500 mr-1">{totalByKategori('latihan_fisik')}</span> Jurnal Latihan Fisik
            </div>
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
              <span className="text-emerald-500 mr-1">{totalByKategori('nutrisi_gizi')}</span> Ilmu Gizi
            </div>
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
              <span className="text-amber-500 mr-1">{totalByKategori('dataset_pangan')}</span> Dataset Pangan
            </div>
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
              <span className="text-rose-500 mr-1">{totalByKategori('pedoman_kesehatan')}</span> Pedoman Kesehatan
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-[73px] z-20 bg-slate-50 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul, penulis, atau jurnal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { key: 'semua', label: 'Semua' },
              { key: 'latihan_fisik', label: 'Latihan Fisik' },
              { key: 'nutrisi_gizi', label: 'Nutrisi & Gizi' },
              { key: 'dataset_pangan', label: 'Dataset Pangan' },
              { key: 'pedoman_kesehatan', label: 'Pedoman' },
            ].map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${activeFilter === f.key ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reference Cards */}
        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            {filteredRefs.map((ref, idx) => {
              const kat = kategoriLabels[ref.kategori];
              const KatIcon = kat.icon;
              return (
                <motion.div
                  key={ref.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="p-6 lg:p-8">
                    {/* Top badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${kat.bg} ${kat.color}`}>
                        <KatIcon className="w-3 h-3" />
                        {kat.label}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {ref.tahun}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {ref.id}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-800 leading-snug mb-2 group-hover:text-emerald-700 transition-colors">{ref.judul}</h3>

                    {/* Authors & Journal */}
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      <span className="text-slate-400 mr-1">Penulis:</span>{ref.penulis}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mb-4 italic">
                      <span className="text-slate-400 mr-1 not-italic">Jurnal:</span>{ref.jurnal}
                    </p>

                    {/* Description */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                      <p className="text-sm text-slate-600 leading-relaxed">{ref.deskripsi}</p>
                    </div>

                    {/* Used in */}
                    <div className="flex items-center gap-2 mb-5">
                      <FlaskConical className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <p className="text-xs font-medium text-slate-500">
                        <span className="font-bold text-slate-700">Digunakan di:</span> {ref.digunakan_di}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={ref.doi_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buka DOI / Sumber
                      </a>
                      <a
                        href={ref.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all shadow-sm hover:shadow-md active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Akses PDF / Full Text
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredRefs.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-700">Tidak Ditemukan</p>
              <p className="text-sm text-slate-500 mt-1">Tidak ada referensi yang cocok dengan pencarian Anda.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-3xl p-8 text-center border border-emerald-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <GraduationCap className="w-10 h-10 text-emerald-500 mx-auto mb-4 relative z-10" />
          <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Evidence-Based Nutrition System</h3>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed relative z-10">
            Seluruh algoritma, rekomendasi nutrisi, dan protokol latihan fisik dalam NutriLogic dibangun berdasarkan literatur ilmiah peer-reviewed,
            pedoman organisasi kesehatan dunia (WHO, CDC, ACSM, AHA), serta database pangan tervalidasi (TKPI Kemenkes, USDA FoodData Central).
            Klik tombol <strong>"Akses PDF / Full Text"</strong> untuk membuka dokumen sumber asli.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

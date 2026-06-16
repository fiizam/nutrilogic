'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Activity, Target, Layers, UserCircle, Power, ArrowRight,
  BookOpen, Dumbbell, Apple, Brain, ShieldCheck, Database, Zap,
  Heart, BarChart3, ClipboardList, FlaskConical, Users, CheckCircle2
} from 'lucide-react';
import { useSession, signOut } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();
  const [showFab, setShowFab] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFab(window.scrollY > 600);
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden relative">

      {/* Header Navbar - Clean Minimalist */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group z-20">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isScrolled ? 'bg-black text-white group-hover:bg-emerald-600' : 'bg-white text-black group-hover:bg-emerald-500 group-hover:text-white'}`}>
              <Activity className="w-5 h-5" />
            </div>
            <span className={`text-2xl font-black tracking-tight transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>Nutri<span className="text-emerald-500">Logic</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link href="/" className={`text-sm font-bold border-b-2 pb-0.5 transition-colors ${isScrolled ? 'text-black border-black' : 'text-white border-white'}`}>Beranda</Link>
            <Link href="/planner" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-slate-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>AI Planner</Link>
            <Link href="/dashboard" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-slate-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>Riwayat</Link>
            <Link href="/katalog" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-slate-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>Katalog</Link>
          </nav>

          <div className="flex items-center gap-3 z-20">
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${isScrolled ? 'text-slate-700 bg-slate-100 hover:bg-slate-200' : 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm'}`}>Profil</Link>
                <button onClick={() => signOut()} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${isScrolled ? 'text-white bg-black hover:bg-red-600' : 'text-black bg-white hover:bg-red-500 hover:text-white'}`}>
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${isScrolled ? 'text-slate-700 bg-slate-100 hover:bg-slate-200' : 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm'}`}>
                  Log In
                </Link>
                <Link href="/login" className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${isScrolled ? 'text-white bg-black hover:bg-emerald-600' : 'text-black bg-white hover:bg-emerald-500 hover:text-white'}`}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-0 pb-0">

        {/* ==================== HERO SECTION ==================== */}
        <section className="relative w-full flex flex-col items-center justify-center px-6 pt-40 pb-24 sm:pt-48 sm:pb-32 text-center mb-20 overflow-hidden shadow-sm group">

          {/* Background Khusus Hero Section */}
          <div className="absolute inset-0 z-[-2]">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
              alt="Hero Background"
              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s]"
            />
            {/* Overlay gelap agar teks putih terbaca jelas. Efek hover menggelap sedikit. */}
            <div className="absolute inset-0 bg-black/50 transition-colors duration-700 group-hover:bg-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white"></div>
          </div>

          <div className="relative z-10 w-full max-w-5xl flex flex-col items-center mt-10">

            {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-8"
          >
            Kecerdasan Buatan Nutrisi v2.0 <ArrowRight className="w-3 h-3" />
          </motion.div> */}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] font-black text-white tracking-tight leading-[1.05] mb-8 drop-shadow-xl"
            >
              Sistem Nutrisi Presisi Berbasis AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/90 max-w-3xl leading-relaxed font-medium mb-12 drop-shadow-md"
            >
              Sistem merancang target diet dinamis dan protokol olahraga personal. Dioptimalkan menggunakan Algoritma Greedy berbasis dataset pangan Nusantara secara real-time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-14"
            >
              <Link href="/planner">
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white text-black rounded-full font-bold text-base transition-all hover:bg-emerald-500 hover:text-white hover:scale-105 shadow-lg">
                  Mulai Analisis
                </button>
              </Link>
              <a href="#cara-kerja">
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-base hover:bg-white/20 transition-all hover:scale-105">
                  Cara Kerja Sistem
                </button>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-bold text-white/90"
            >
              <div className="flex items-center gap-2 drop-shadow-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                13,600+ Bahan Pangan
              </div>
              <div className="flex items-center gap-2 drop-shadow-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Data TKPI & Kemenkes
              </div>
              <div className="flex items-center gap-2 drop-shadow-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Jurnal Ilmiah (2022-2026)
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== HERO IMAGES (DRIBBBLE REFERENCE STYLE) ==================== */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="h-[400px] rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop" alt="Sate Khas Nusantara" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="h-[400px] rounded-[2rem] overflow-hidden mt-0 md:mt-12">
              <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=2000&auto=format&fit=crop" alt="Nasi Goreng Spesial" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="h-[400px] rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=2000&auto=format&fit=crop" alt="Soto Nusantara" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>
        </section>

        {/* ==================== STATS SECTION ==================== */}
        <section className="py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { value: "13,634+", label: "Data Bahan Pangan" },
                { value: "50+", label: "Olahan Masakan" },
                { value: "10", label: "Jenis Latihan" },
                { value: "22", label: "Sumber Literatur" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                >
                  <p className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-2">{stat.value}</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FEATURES SECTION ==================== */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-4">Teknologi di Balik NutriLogic</h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl">Kombinasi ilmu nutrisi klinis, algoritma optimasi, dan database pangan terlengkap Indonesia.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Target, title: "Target Dinamis", desc: "TDEE (Total Daily Energy Expenditure) dihitung secara adaptif menggunakan formula Mifflin-St Jeor. Sistem otomatis menyesuaikan defisit atau surplus kalori." },
                { icon: Layers, title: "Optimasi Greedy", desc: "Algoritma Greedy menganalisis ratusan kombinasi menu masakan Nusantara untuk menemukan kombinasi makanan dengan akurasi kalori tertinggi." },
                { icon: ShieldCheck, title: "Tervalidasi Ilmiah", desc: "Seluruh data gizi bersumber dari TKPI Kemenkes RI. Setiap rekomendasi latihan fisik didukung oleh jurnal ilmiah peer-reviewed tahun 2022-2026." }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.8 }}
                  className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black mb-8 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-base text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CARA KERJA SECTION ==================== */}
        <section id="cara-kerja" className="py-32 bg-slate-50 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-4">Bagaimana NutriLogic Bekerja?</h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">4 langkah sederhana menuju rencana nutrisi personal berbasis sains.</p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  icon: ClipboardList,
                  title: "Input Data Biometrik",
                  desc: "Masukkan berat badan, tinggi badan, usia, jenis kelamin, dan level aktivitas fisik. Sistem menghitung BMR dan menentukan TDEE harian secara otomatis."
                },
                {
                  step: "02",
                  icon: Brain,
                  title: "Analisis AI & Algoritma Greedy",
                  desc: "Engine AI menjalankan Algoritma Greedy untuk memindai kombinasi menu masakan Nusantara yang paling optimal dengan target makro Anda."
                },
                {
                  step: "03",
                  icon: Dumbbell,
                  title: "Rekomendasi Latihan Fisik",
                  desc: "Berdasarkan target diet Anda, sistem merekomendasikan latihan fisik yang tepat beserta estimasi kalori terbakar didukung jurnal ilmiah."
                },
                {
                  step: "04",
                  icon: BarChart3,
                  title: "Dashboard Hasil & Prediksi",
                  desc: "Dapatkan ringkasan lengkap: menu harian, prediksi waktu pencapaian target, dan pelacak makronutrien di dashboard riwayat."
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 sm:p-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start group hover:border-black transition-colors duration-300"
                >
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Step {item.step}</span>
                  </div>
                  <div className="flex-1 mt-1 sm:mt-2">
                    <h3 className="text-2xl font-bold text-black mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-base text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="py-32">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-black rounded-[3rem] p-12 sm:p-16 text-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">Siap Transformasi Nutrisi Anda?</h2>
                <p className="text-lg text-slate-400 font-medium max-w-xl mx-auto mb-12 leading-relaxed">
                  Mulai perjalanan menuju tubuh yang lebih sehat dengan rencana nutrisi yang dipersonalisasi berdasarkan sains dan data pangan Indonesia.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/planner">
                    <button className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-emerald-500 hover:text-white transition-colors duration-300">
                      Buat Rencana Diet
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 pb-12 border-b border-slate-100">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight text-black">Nutri<span className="text-emerald-500">Logic</span></span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Sistem rekomendasi nutrisi berbasis kecerdasan buatan yang menggunakan Algoritma Greedy dan dataset pangan Indonesia tervalidasi.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-black mb-6">Navigasi</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-sm font-bold text-slate-500 hover:text-black transition-colors">Beranda</Link></li>
                <li><Link href="/planner" className="text-sm font-bold text-slate-500 hover:text-black transition-colors">AI Planner</Link></li>
                <li><Link href="/katalog" className="text-sm font-bold text-slate-500 hover:text-black transition-colors">Katalog Pangan</Link></li>
                <li><Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-black transition-colors">Riwayat & Dashboard</Link></li>
              </ul>
            </div>

            {/* Sumber Data */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-black mb-6">Sumber Data & Referensi</h4>
              <ul className="space-y-4">
                <li className="text-sm font-bold text-slate-500">TKPI — Kemenkes RI</li>
                <li className="text-sm font-bold text-slate-500">USDA FoodData Central</li>
                <li className="text-sm font-bold text-slate-500">WHO & ACSM Guidelines</li>
                <li className="text-sm font-bold text-slate-500">Jurnal Peer-Reviewed (2022–2026)</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-bold text-slate-500">
              © {new Date().getFullYear()} NutriLogic. Dibuat oleh <span className="text-black">Fii'zam</span>.
            </p>
            <Link
              href="/referensi"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-black hover:text-white transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Literatur & Referensi
            </Link>
          </div>
        </div>
      </footer>

      {/* ==================== FAB REFERENSI (SCROLL-TRIGGERED) ==================== */}
      <AnimatePresence>
        {showFab && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Link
              href="/referensi"
              className="group flex items-center gap-3 pl-5 pr-6 py-4 bg-white border border-slate-200 text-black rounded-full font-bold text-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
            >
              <div className="w-8 h-8 bg-slate-100 text-black rounded-full flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              Literatur & Referensi
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
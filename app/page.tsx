'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Activity, Target, Layers, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const FloatingMacroCard = ({ title, value, unit, color, delay, position, floatOffset }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100 }}
      className={`absolute ${position} z-20 pointer-events-none`}
    >
      <motion.div
        animate={{ y: [0, floatOffset, 0] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="px-5 py-4 rounded-2xl bg-white border border-slate-100 shadow-lg flex flex-col gap-1 min-w-[130px] transform-gpu will-change-transform"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          <span className="text-xs font-medium text-slate-400">{unit}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

import { useSession, signOut } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();
  const [isCalculating, setIsCalculating] = useState(true);
  
  // 3D tilt effect setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(smoothY, [-500, 500], [15, -15]);
  const rotateY = useTransform(smoothX, [-500, 500], [-15, 15]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }
  
  useEffect(() => {
    // Simulate algorithm calculating optimal diet
    const timer = setTimeout(() => setIsCalculating(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-hidden relative font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Header Navbar */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">Nutri<span className="text-emerald-500">Logic</span></span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/planner" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Menu Planner</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Profil Pengguna</Link>
                <button onClick={() => signOut()} className="text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors">Logout</button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-white bg-slate-900 hover:bg-emerald-600 px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-lg">
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Very Clean & Fresh Background Elements - Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-50 to-transparent" />
        <div 
          className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-emerald-50/40 to-transparent blur-[100px] transform-gpu will-change-transform opacity-70"
        />
        <div 
          className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-sky-50/40 to-transparent blur-[100px] transform-gpu will-change-transform opacity-70"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-24 relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-[90vh] gap-16">
        
        {/* Left Content - Typography & CTA */}
        <div className="w-full lg:w-1/2 space-y-8 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-sm font-medium text-slate-600"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            Algoritma Greedy Aktif
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Presisi <br className="hidden sm:block" />
            <span className="text-emerald-500">Platform Nutrisi.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-slate-600 max-w-lg leading-relaxed"
          >
            Kalkulasi target diet dinamis dan protokol olahraga personal. Dioptimalkan menggunakan Algoritma Greedy berbasis dataset pangan Nusantara.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="/planner" className="w-full sm:w-auto">
              <button className="w-full group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-sm transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 active:scale-95">
                Mulai Analisis
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <a href="#cara-kerja" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all active:scale-95">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Cara Kerja
            </a>
          </motion.div>
        </div>

        {/* Right Content - 3D Abstract "Diet Program" Visualization */}
        <div 
          className="w-full lg:w-1/2 relative h-[450px] sm:h-[500px] flex items-center justify-center mt-10 lg:mt-0 cursor-default"
          style={{ perspective: 1000 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          
          {/* Main Central Processing Hub with 3D Rotate Effect */}
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center z-10"
          >
            {/* Animated Dashed Ring */}
            <motion.div 
              style={{ transform: "translateZ(-20px)" }}
              className="absolute inset-[-24px] rounded-full border border-dashed border-slate-200 animate-[spin_20s_linear_infinite] transform-gpu will-change-transform" 
            />
            
            {/* Animated Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100" style={{ transform: "translateZ(10px)" }}>
              <circle cx="50" cy="50" r="48" fill="none" stroke="#f1f5f9" strokeWidth="2" />
              <motion.circle 
                cx="50" cy="50" r="48" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isCalculating ? 0.15 : 0.8 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            
            <div className="absolute inset-4 rounded-full border border-slate-50 bg-slate-50/50" style={{ transform: "translateZ(5px)" }} />
            
            <motion.div 
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <Activity className={`w-6 h-6 mb-1 ${isCalculating ? 'text-slate-300' : 'text-emerald-500'} transition-colors duration-500`} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target TDEE</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                  {isCalculating ? (
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  ) : "2,450"}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-white shadow-sm border border-slate-100 px-3 py-1 rounded-full mt-1">KKAL / HARI</span>
            </motion.div>
          </motion.div>

          {/* Floating Data Cards representing macros */}
          <FloatingMacroCard 
            title="Protein" 
            value={isCalculating ? "--" : "165"} 
            unit="g" 
            color="bg-rose-500" 
            delay={0.2} 
            floatOffset={-12}
            position="top-[5%] left-[0%] sm:left-[5%]" 
          />
          <FloatingMacroCard 
            title="Karbohidrat" 
            value={isCalculating ? "--" : "210"} 
            unit="g" 
            color="bg-amber-500" 
            delay={0.4} 
            floatOffset={10}
            position="bottom-[10%] left-[5%] sm:left-[10%]" 
          />
          <FloatingMacroCard 
            title="Lemak" 
            value={isCalculating ? "--" : "70"} 
            unit="g" 
            color="bg-sky-500" 
            delay={0.6} 
            floatOffset={-8}
            position="top-[25%] right-[0%] sm:right-[5%]" 
          />

        </div>
      </div>

      {/* Clean Minimalist Feature Section */}
      <div className="relative z-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Target, title: "Target Dinamis", desc: "TDEE adaptif yang otomatis menyesuaikan dengan fase diet Anda (Surplus, Defisit, Maintenance)." },
              { icon: Layers, title: "Optimasi Greedy", desc: "Pemilihan dan kombinasi menu harian paling optimal diselesaikan dengan Constraint Satisfaction Problem." },
              { icon: Activity, title: "Data Tervalidasi", desc: "Menggunakan standar dataset tervalidasi dari Kemenkes, USDA, & Compendium of Physical Activities." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 + (idx * 0.1), duration: 0.5 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 mb-4">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Tahapan Membuat Planner */}
      <div id="cara-kerja" className="relative z-20 pb-24 bg-slate-50/50 pt-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tahapan Membuat Planner</h2>
            <p className="text-slate-500 mt-4 text-lg">Mulai perjalanan diet optimal Anda dalam 3 langkah mudah berbasis data biometrik.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-emerald-100" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-emerald-50 shadow-lg flex items-center justify-center mb-6">
                <Target className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">1. Isi Biometrik</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">Masukkan data umur, tinggi, berat badan, serta target diet (surplus/defisit).</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-emerald-50 shadow-lg flex items-center justify-center mb-6">
                <Activity className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">2. AI Kalkulasi</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">Sistem otomatis menghitung TDEE dan mengalokasikan target kalori menggunakan algoritma *Greedy*.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-emerald-50 shadow-lg flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">3. Terima & Simpan Plan</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">Rekomendasi hidangan harian dan jadwal latihan akan dirancang. Simpan langsung ke akun Anda!</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
'use client';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, Eye, X, Flame, Target, Utensils, 
  Info, CheckCircle2, ChevronLeft, Droplets, Moon, Award, ArrowRightLeft,
  Coffee, Footprints, Zap, ArrowDownToLine, Scale, ArrowUpToLine,
  TrendingDown, TrendingUp, AlertTriangle, CalendarDays, Sparkles, LayoutDashboard, Dumbbell, Apple, ActivityIcon, Save, Lock
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FormDataUser, HasilRekomendasi } from '@/types';
import { calculateEnergi } from '@/lib/algorithms'; 
import Link from 'next/link';

// CUSTOM STANDARD INPUT
const StandardInput = ({ label, value, onChange, unit, min = 0, placeholder="0" }: any) => {
  return (
    <div className="flex flex-col gap-1.5 mb-2">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
        <input 
          type="number" 
          value={value || ''} 
          onChange={(e) => onChange(Number(e.target.value) || 0)} 
          placeholder={placeholder}
          className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
        />
        <span className="text-xs font-medium text-slate-400 ml-2">{unit}</span>
      </div>
    </div>
  );
};

export default function PlannerPage() {
  const [formData, setFormData] = useState<FormDataUser>({ 
    berat: 0, tinggi: 0, umur: 0, target_berat: 0, 
    gender: 'pria', aktivitas: 'moderate', targetDiet: 'stabil', preferensi: 'seimbang', pantangan: '' 
  });
  
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<HasilRekomendasi | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'workout'>('dashboard');
  const [activeMealTab, setActiveMealTab] = useState<'sarapan' | 'siang' | 'malam'>('sarapan');
  
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success'|'error'|'info'}>({ show: false, message: '', type: 'info' });

  const showToast = (message: string, type: 'success'|'error'|'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const { data: session } = useSession();

  const derivedTargetDiet = (!formData.target_berat || formData.target_berat === formData.berat) 
    ? 'stabil' 
    : (formData.berat > formData.target_berat ? 'turun' : 'naik');

  const isFormValid = formData.berat > 0 && formData.tinggi > 0 && formData.umur > 0;

  const handlePreview = () => {
    if (!isFormValid) return showToast("Data biometrik tidak lengkap atau belum valid.", "error");
    const { bmr, tdeeDasar } = calculateEnergi(formData.umur, formData.gender, formData.berat, formData.tinggi, formData.aktivitas);
    setPreviewData({ bmr: Math.round(bmr), tdee: Math.round(tdeeDasar) });
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    
    const payload = { ...formData, targetDiet: derivedTargetDiet };

    try {
      const res = await fetch('/api/planner', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if(data.success) { 
        setHasil(data.data); 
        setActiveTab('dashboard'); 
      }
    } finally { setLoading(false); }
  };

  const handleSavePlan = async () => {
    if (!session) {
      showToast("Silakan login terlebih dahulu untuk menyimpan plan.", "error");
      return;
    }
    
    // Simulate loading toast
    showToast("Menyimpan rencana nutrisi Anda...", "info");

    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planData: hasil })
      });
      if (res.ok) showToast("Rencana Diet berhasil disimpan!", "success");
      else showToast("Gagal menyimpan. Coba lagi.", "error");
    } catch (e) {
      showToast("Terjadi kesalahan sistem.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* ================= PANEL KIRI: FORM SIDEBAR ================= */}
      <aside className="w-full lg:w-[400px] lg:h-screen lg:sticky lg:top-0 bg-white border-r border-slate-200 shadow-sm flex flex-col z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-emerald-500" /> Biometrik
            </h2>
            <p className="text-xs text-slate-500 mt-1">Konfigurasikan parameter Anda</p>
          </div>
          <Link href="/" className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl m-4 border border-slate-100">
                  <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                  <p className="text-slate-600 font-bold text-sm tracking-wide animate-pulse">Memproses Data...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4">
              <StandardInput label="Berat" value={formData.berat} onChange={(v:number) => setFormData({...formData, berat: v})} unit="kg" />
              <StandardInput label="Tinggi" value={formData.tinggi} onChange={(v:number) => setFormData({...formData, tinggi: v})} unit="cm" />
              <StandardInput label="Usia" value={formData.umur} onChange={(v:number) => setFormData({...formData, umur: v})} unit="thn" />
              <StandardInput label="Target" value={formData.target_berat} onChange={(v:number) => setFormData({...formData, target_berat: v})} unit="kg" placeholder="-" />
            </div>

            <div>
              <div className="flex bg-slate-100 p-1.5 rounded-xl">
                <button type="button" onClick={() => setFormData({...formData, gender: 'pria'})} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.gender === 'pria' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>Pria</button>
                <button type="button" onClick={() => setFormData({...formData, gender: 'wanita'})} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.gender === 'wanita' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>Wanita</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">Level Aktivitas Fisik</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'sedentary', label: 'Sedentary (Kurang Aktif)', desc: 'Jarang olahraga, banyak duduk', icon: Coffee },
                  { id: 'light', label: 'Light (Ringan)', desc: 'Olahraga 1-3 hari/minggu', icon: Footprints },
                  { id: 'moderate', label: 'Moderate (Sedang)', desc: 'Olahraga 3-5 hari/minggu', icon: Activity },
                  { id: 'active', label: 'Active (Sangat Aktif)', desc: 'Olahraga 6-7 hari/minggu', icon: Zap },
                ].map((opt) => (
                  <button type="button" key={opt.id} onClick={() => setFormData({...formData, aktivitas: opt.id})}
                    className={`p-3 rounded-xl border text-left flex flex-col items-start gap-2 transition-all ${formData.aktivitas === opt.id ? 'bg-emerald-50 border-emerald-200 shadow-sm ring-1 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                    <opt.icon className={`w-4 h-4 ${formData.aktivitas === opt.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${formData.aktivitas === opt.id ? 'text-emerald-800' : 'text-slate-600'}`}>{opt.label}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Target Mode Diet</p>
                <div className="flex items-center gap-2">
                  {derivedTargetDiet === 'turun' ? <span className="text-emerald-600 font-bold text-sm flex items-center gap-1.5"><ArrowDownToLine className="w-4 h-4"/> Defisit</span> :
                   derivedTargetDiet === 'naik' ? <span className="text-sky-600 font-bold text-sm flex items-center gap-1.5"><ArrowUpToLine className="w-4 h-4"/> Surplus</span> :
                   <span className="text-slate-700 font-bold text-sm flex items-center gap-1.5"><Scale className="w-4 h-4"/> Stabil</span>}
                </div>
              </div>
              <button type="button" onClick={handlePreview} title="Preview TDEE" className="text-slate-400 bg-slate-50 p-2.5 border border-slate-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                <Eye className="w-5 h-5"/>
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Preferensi Makro</label>
              <select value={formData.preferensi} onChange={(e) => setFormData({...formData, preferensi: e.target.value as any})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer">
                <option value="seimbang">Makro Seimbang (Disarankan)</option>
                <option value="rendah_karbo">Rendah Karbohidrat</option>
                <option value="tinggi_protein">Tinggi Protein</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Alergi / Pantangan</label>
              <input type="text" value={formData.pantangan} onChange={(e) => setFormData({...formData, pantangan: e.target.value})} placeholder="Cth: Susu, Kacang" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:font-normal" />
            </div>

            <div className="pt-2">
              {session ? (
                <button type="submit" disabled={!isFormValid || loading} className="w-full h-12 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 disabled:opacity-40 disabled:hover:bg-slate-900 disabled:shadow-none flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Generate Plan
                </button>
              ) : (
                <Link href="/login" className="w-full h-12 rounded-xl bg-slate-50 text-slate-500 border border-slate-200 font-semibold text-sm hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-300 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Login untuk Generate Plan
                </Link>
              )}
            </div>
          </form>
        </div>
      </aside>

      {/* ================= PANEL KANAN: HASIL DASHBOARD ================= */}
      <main className="flex-1 lg:h-screen overflow-y-auto p-6 lg:p-10 bg-[#FAFAFA] relative">
        <div className="max-w-5xl mx-auto">
          {!hasil ? (
            <div className="h-full min-h-[calc(100vh-5rem)] rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                <LayoutDashboard className="w-8 h-8 text-slate-300"/>
              </div>
              <p className="text-2xl font-bold text-slate-800 tracking-tight">Belum Ada Plan Aktif</p>
              <p className="text-sm font-medium text-slate-400 mt-2">Isi form di sebelah kiri untuk menghasilkan rencana nutrisi Anda.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
              
              {/* TOP NAVIGATION TABS */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/60 shadow-inner">
                  <button type="button" onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                    <LayoutDashboard className="w-4 h-4"/> Ringkasan
                  </button>
                  <button type="button" onClick={() => setActiveTab('meals')} className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'meals' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Apple className="w-4 h-4"/> Nutrisi
                  </button>
                  <button type="button" onClick={() => setActiveTab('workout')} className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'workout' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Dumbbell className="w-4 h-4"/> Latihan
                  </button>
                </div>
                
                {session ? (
                  <button onClick={handleSavePlan} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all">
                    <Save className="w-4 h-4" /> Simpan Plan
                  </button>
                ) : (
                  <Link href="/login" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all">
                    <Save className="w-4 h-4" /> Login untuk Simpan
                  </Link>
                )}
              </div>

              <div className="flex-1">
                <AnimatePresence mode="wait">
                  
                  {activeTab === 'dashboard' && (
                    <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
                      
                      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
                          <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3"><CalendarDays className="w-5 h-5 text-sky-500" /> Linimasa Prediksi</h3>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${hasil.prediksi.warning ? 'bg-red-50 text-red-600 border-red-200' : 'bg-sky-50 text-sky-600 border-sky-200'}`}>
                            {hasil.prediksi.kalori_harian_status}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-6 rounded-2xl relative z-10 mb-8 shadow-sm">
                          <div className="text-center w-24">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Saat Ini</p>
                            <p className="font-black text-3xl text-slate-800">{formData.berat}<span className="text-sm font-bold text-slate-400 ml-1">kg</span></p>
                          </div>
                          <div className="flex-1 px-4 sm:px-8 relative flex flex-col items-center">
                            <div className="w-full h-3 bg-slate-200 rounded-full relative overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeOut" }} className={`absolute top-0 left-0 h-full ${derivedTargetDiet === 'turun' ? 'bg-emerald-400' : derivedTargetDiet === 'naik' ? 'bg-sky-400' : 'bg-slate-400'}`}></motion.div>
                            </div>
                            {hasil.prediksi.minggu_estimasi > 0 && (
                              <div className="absolute -top-6 px-4 py-1.5 bg-white shadow-md border border-slate-100 rounded-full text-[11px] text-slate-700 font-bold flex items-center gap-1.5">
                                {derivedTargetDiet === 'turun' ? <TrendingDown className="w-3.5 h-3.5 text-emerald-500"/> : derivedTargetDiet === 'naik' ? <TrendingUp className="w-3.5 h-3.5 text-sky-500"/> : null}
                                Estimasi: {hasil.prediksi.minggu_estimasi} Minggu
                              </div>
                            )}
                          </div>
                          <div className="text-center w-24">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Target</p>
                            <p className="font-black text-3xl text-slate-800">{formData.target_berat || formData.berat}<span className="text-sm font-bold text-slate-400 ml-1">kg</span></p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100"><Activity className="w-5 h-5 text-slate-400"/></div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Laju Perubahan</p>
                              <p className="font-black text-slate-800 text-xl">{hasil.prediksi.perubahan_per_minggu} <span className="text-xs font-bold text-slate-400 ml-1">kg/Mgg</span></p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center">
                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{hasil.prediksi.rekomendasi_konsistensi}</p>
                          </div>
                        </div>

                        <div className={`mt-5 p-5 rounded-2xl border text-sm font-medium flex items-start gap-3 relative z-10 ${hasil.prediksi.warning ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                          <div className={`p-1.5 rounded-full ${hasil.prediksi.warning ? 'bg-red-100' : 'bg-emerald-100'} flex-shrink-0`}>
                            {hasil.prediksi.warning ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                          </div>
                          <p className="leading-relaxed">{hasil.prediksi.pesan_realistis}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl flex flex-col items-center justify-center">
                          <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center mb-3"><Droplets className="w-6 h-6 text-cyan-500"/></div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Target Hidrasi</p>
                          <p className="text-2xl font-black text-slate-800 tracking-tight">{hasil.holistic.air_liter} <span className="text-sm font-bold text-slate-400 ml-1">L</span></p>
                        </div>
                        <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl flex flex-col items-center justify-center">
                          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3"><Moon className="w-6 h-6 text-indigo-500"/></div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Target Tidur</p>
                          <p className="text-lg font-bold text-slate-800">{hasil.holistic.tidur_jam}</p>
                        </div>
                        <div className="bg-white border border-emerald-200 shadow-sm p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-300 transition-colors">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-3 relative z-10"><Award className="w-6 h-6 text-emerald-500"/></div>
                          <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-widest mb-1 relative z-10">Skor Kesehatan AI</p>
                          <p className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{hasil.holistic.ai_health_score}<span className="text-sm font-bold text-slate-400 ml-1">/100</span></p>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 relative">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                          <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3"><Target className="w-5 h-5 text-rose-500" /> Pelacak Makro</h3>
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target TDEE</p>
                            <p className="text-4xl font-black text-slate-800 tracking-tight">{hasil.energi.tdeeTarget} <span className="text-sm text-slate-400 uppercase">kcal</span></p>
                          </div>
                        </div>
                        <div className="space-y-6">
                          {[ { label: "Target Protein", val: (hasil.menu.sarapan.totalProtein+hasil.menu.siang.totalProtein+hasil.menu.malam.totalProtein), tar: hasil.macroTargets.protein, color: "bg-rose-500", bgTrack: "bg-rose-50" },
                             { label: "Target Lemak", val: (hasil.menu.sarapan.totalLemak+hasil.menu.siang.totalLemak+hasil.menu.malam.totalLemak), tar: hasil.macroTargets.lemak, color: "bg-amber-500", bgTrack: "bg-amber-50" },
                             { label: "Target Karbohidrat", val: (hasil.menu.sarapan.totalKarbo+hasil.menu.siang.totalKarbo+hasil.menu.malam.totalKarbo), tar: hasil.macroTargets.karbo, color: "bg-sky-500", bgTrack: "bg-sky-50" },
                          ].map(m => (
                            <div key={m.label}>
                              <div className="flex justify-between text-sm text-slate-800 mb-2 font-bold"><span>{m.label}</span><span className="text-slate-500">{Math.round(m.val)}g <span className="text-slate-300 font-normal">/</span> {m.tar}g</span></div>
                              <div className={`w-full ${m.bgTrack} h-3 rounded-full overflow-hidden border border-slate-100`}><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((m.val/m.tar)*100, 100)}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full ${m.color} rounded-full`}></motion.div></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'meals' && (
                    <motion.div key="meals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
                      
                      <div className="rounded-2xl p-6 bg-emerald-50 border border-emerald-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/60 rounded-bl-full pointer-events-none"></div>
                         <div className="flex items-start gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-emerald-100 shadow-sm">
                              <Sparkles className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-emerald-700 mb-1.5 uppercase tracking-widest">Wawasan Ilmiah AI</h4>
                              <p className="text-sm font-medium text-emerald-900 leading-relaxed">{hasil.prediksi.smart_nutrition_insight}</p>
                            </div>
                         </div>
                      </div>

                      <div className="flex space-x-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                        {(['sarapan', 'siang', 'malam'] as const).map((meal) => (
                          <button 
                            key={meal}
                            type="button" 
                            onClick={() => setActiveMealTab(meal)} 
                            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeMealTab === meal ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'}`}
                          >
                            {meal === 'sarapan' ? <Coffee className="w-4 h-4"/> : meal === 'siang' ? <Utensils className="w-4 h-4"/> : <Moon className="w-4 h-4"/>} 
                            {meal}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={activeMealTab}
                          initial={{ opacity: 0, x: 10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: -10 }} 
                          transition={{ duration: 0.2 }}
                        >
                          {(() => {
                            const sesi = activeMealTab;
                            const targetSesi = Math.round(hasil.energi.tdeeTarget * (sesi === 'siang' ? 0.4 : 0.3));
                            const persentase = Math.min((hasil.menu[sesi].totalKalori / targetSesi) * 100, 100);

                            return (
                              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${persentase}%` }}></div>
                                <div className="p-6 lg:p-8">
                                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-5">
                                    <h5 className="text-xl font-bold text-slate-800 capitalize flex items-center gap-3">
                                      <span className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                                        {sesi === 'sarapan' ? <Coffee className="w-5 h-5 text-slate-500"/> : sesi === 'siang' ? <Utensils className="w-5 h-5 text-slate-500"/> : <Moon className="w-5 h-5 text-slate-500"/>}
                                      </span> 
                                      {sesi}
                                    </h5>
                                    <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm"><span className="text-lg font-black text-slate-800">{Math.round(hasil.menu[sesi].totalKalori)}</span><span className="text-[10px] uppercase font-bold text-slate-400 ml-1.5">/ {targetSesi} kcal</span></div>
                                  </div>

                                  <div className="space-y-4">
                                    {hasil.menu[sesi].menu.length === 0 ? (
                                       <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-medium text-slate-500 flex items-center gap-3"><Info className="w-5 h-5 text-slate-400"/> Tidak ada kandidat lolos filter CSP.</div>
                                    ) : (
                                      hasil.menu[sesi].menu.map((item, i) => (
                                        <div key={i} className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl flex flex-col gap-4 hover:shadow-md hover:border-slate-300 transition-all">
                                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div>
                                              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Basis: {item.nama_bahan}</span>
                                              <p className="font-bold text-slate-800 text-lg leading-tight mb-1.5">{item.nama_masakan}</p>
                                              <p className="text-sm font-medium text-slate-500">Sajian: {item.ukuran_sajian} <span className="mx-2 text-slate-300">•</span> Na: {item.natrium}mg</p>
                                            </div>
                                            <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 text-center min-w-[100px]">
                                              <span className="font-black text-2xl text-emerald-600 block">{item.kalori}</span>
                                              <span className="text-[10px] font-bold uppercase text-emerald-500/70">kcal</span>
                                            </div>
                                          </div>
                                          
                                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium"><span className="text-indigo-600 font-bold mr-1">Insight:</span> {item.alasan}</p>
                                          </div>
                                          
                                          {item.alternatif_olahan.length > 0 && (
                                            <div className="mt-1">
                                              <p className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5 mb-2.5 font-bold tracking-widest"><ArrowRightLeft className="w-3.5 h-3.5"/> Substitusi Makanan</p>
                                              <div className="flex flex-wrap gap-2">
                                                {item.alternatif_olahan.slice(0,3).map(alt => (
                                                  <span key={alt} className="text-xs font-semibold px-3 py-1.5 bg-sky-50 rounded-lg border border-sky-100 text-sky-700">{alt}</span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {activeTab === 'workout' && (
                    <motion.div key="workout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-5">
                      {hasil.olahraga.map((ol, idx) => (
                        <div key={idx} className="rounded-3xl p-6 lg:p-8 bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                          <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-500"></div>
                          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                            <div>
                              <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest mb-3">{ol.kategori} &bull; {ol.intensitas}</div>
                              <h4 className="text-xl font-bold text-slate-800">{ol.nama}</h4>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl w-full md:w-auto">
                              <div className="text-center px-4 border-r border-slate-200"><div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">Durasi</div><div className="font-black text-slate-800 text-xl">{ol.durasi_menit}<span className="text-xs font-bold text-slate-400 ml-1">m</span></div></div>
                              <div className="text-center px-4"><div className="text-[10px] text-rose-500 uppercase font-bold tracking-widest mb-1.5 flex items-center justify-center gap-1"><Flame className="w-3.5 h-3.5"/> Terbakar</div><div className="font-black text-rose-500 text-xl">~{ol.estimasi_kalori_terbakar}<span className="text-xs font-bold text-rose-400 ml-1">kcal</span></div></div>
                            </div>
                          </div>
                          <div className="border-t border-slate-100 pt-5 space-y-3">
                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{ol.alasan}</p>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Sumber Validasi</p>
                              <p className="text-xs font-semibold text-slate-700">{ol.sumber_validasi}</p>
                              {ol.literatur && (
                                <>
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-2">Referensi Jurnal (2022-2026)</p>
                                  <p className="text-xs font-medium text-slate-600 italic leading-relaxed">{ol.literatur}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </motion.div>
          )}
        </div>
      </main>

      {/* ================= MODAL PREVIEW TDEE ================= */}
      <AnimatePresence>
        {showModal && previewData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md p-8 relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-[100px] pointer-events-none"></div>
              <button type="button" onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 transition-colors"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
                <div><h3 className="text-xl font-bold text-slate-800 tracking-tight">Pemindaian Selesai</h3><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Analisis Biometrik</p></div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tingkat Metabolisme Basal (BMR)</p>
                  <p className="text-3xl font-black text-slate-800">{previewData.bmr} <span className="text-sm font-bold text-slate-400 ml-1">kcal</span></p>
                </div>
                <div className="bg-emerald-500 p-6 rounded-2xl border border-emerald-600 shadow-lg shadow-emerald-500/20 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-400 rounded-full blur-2xl"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 mb-2 relative z-10">Total Pengeluaran Energi Harian (TDEE)</p>
                  <p className="text-4xl font-black relative z-10 tracking-tight">{previewData.tdee} <span className="text-base font-bold text-emerald-200 tracking-normal ml-1">kcal</span></p>
                </div>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="w-full mt-8 py-4 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all relative z-10 shadow-lg active:scale-95">Tutup & Lanjutkan Form</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TOAST NOTIFICATION ================= */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
              toast.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-sky-50 text-sky-500'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
               toast.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            <p className="text-sm font-bold text-slate-700 pr-4">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
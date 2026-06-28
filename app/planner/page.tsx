'use client';
import { useState, FormEvent, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, Eye, X, Flame, Target, Utensils, 
  Info, CheckCircle2, ChevronLeft, Droplets, Moon, Award, ArrowRightLeft,
  Coffee, Footprints, Zap, ArrowDownToLine, Scale, ArrowUpToLine,
  TrendingDown, TrendingUp, AlertTriangle, CalendarDays, Sparkles, LayoutDashboard, Dumbbell, Apple, ActivityIcon, Save, Lock
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { FormDataUser, HasilRekomendasi } from '@/types';
import { calculateEnergi } from '@/lib/algorithms'; 
import Link from 'next/link';
import PlanResult from '@/components/PlanResult';

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
  const [activeMealOption, setActiveMealOption] = useState<number>(0);
  
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success'|'error'|'info'}>({ show: false, message: '', type: 'info' });
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [planName, setPlanName] = useState("");

  // Check for existing draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem('nutrivis_planner_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed && (parsed.formData?.berat > 0 || parsed.hasil)) {
          setShowDraftModal(true);
        }
      }
    } catch (e) {
      // Abaikan jika browser memblokir akses penyimpanan lokal
    }
  }, []);

  // Auto-save draft when data changes
  useEffect(() => {
    if (formData.berat > 0 || formData.tinggi > 0 || hasil) {
      try {
        localStorage.setItem('nutrivis_planner_draft', JSON.stringify({ formData, hasil, activeTab }));
      } catch (e) {}
    }
  }, [formData, hasil, activeTab]);

  const handleRestoreDraft = () => {
    try {
      const draft = localStorage.getItem('nutrivis_planner_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.hasil) setHasil(parsed.hasil);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
      }
    } catch(e) {}
    setShowDraftModal(false);
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem('nutrivis_planner_draft');
    } catch (e) {}
    setShowDraftModal(false);
  };

  const showToast = (message: string, type: 'success'|'error'|'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const { data: session } = useSession();

  const targetBerat = formData.target_berat || 0;

  const derivedTargetDiet = (!targetBerat || targetBerat === formData.berat) 
    ? 'stabil' 
    : (formData.berat > targetBerat ? 'turun' : 'naik');

  const isTargetUnderweight = targetBerat > 0 && formData.tinggi > 0 && (targetBerat / Math.pow(formData.tinggi / 100, 2)) < 18.5;

  const isFormValid = formData.berat > 0 && formData.tinggi > 0 && formData.umur >= 19 && formData.umur <= 49 && !isTargetUnderweight;

  const previewMetrics = useMemo(() => {
    if (!formData.berat || !formData.tinggi || !formData.gender) return null;
    const t = parseFloat(formData.tinggi.toString());
    const b = parseFloat(formData.berat.toString());
    if (t <= 0 || b <= 0) return null;

    const imt = b / Math.pow(t / 100, 2);
    let bbi = 0;
    if ((formData.gender === 'pria' && t < 160) || (formData.gender !== 'pria' && t < 150)) {
      bbi = t - 100;
    } else if (formData.gender === 'pria') {
      bbi = 0.9 * (t - 100);
    } else {
      bbi = 0.85 * (t - 100);
    }

    let kategori = '';
    let colorClass = '';
    let bgColorClass = '';
    
    if (imt < 18.5) {
      kategori = 'BB kurang';
      colorClass = 'text-amber-600';
      bgColorClass = 'bg-amber-50 border-amber-100';
    } else if (imt <= 22.9) {
      kategori = 'BB normal';
      colorClass = 'text-emerald-600';
      bgColorClass = 'bg-emerald-50 border-emerald-100';
    } else if (imt <= 24.9) {
      kategori = 'Dengan risiko';
      colorClass = 'text-orange-600';
      bgColorClass = 'bg-orange-50 border-orange-100';
    } else if (imt <= 29.9) {
      kategori = 'Obese I';
      colorClass = 'text-rose-600';
      bgColorClass = 'bg-rose-50 border-rose-100';
    } else {
      kategori = 'Obese II';
      colorClass = 'text-rose-700';
      bgColorClass = 'bg-rose-100 border-rose-200';
    }

    return {
      bmi: imt.toFixed(1),
      bbi: bbi.toFixed(1),
      kategori,
      colorClass,
      bgColorClass
    };
  }, [formData.berat, formData.tinggi, formData.gender]);

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
        body: JSON.stringify({ planData: hasil, nama: planName || `Plan ${new Date().toLocaleDateString('id-ID')}` })
      });
      if (res.ok) {
        showToast("Rencana Diet berhasil disimpan!", "success");
        setShowSaveModal(false);
      } else {
        showToast("Gagal menyimpan. Coba lagi.", "error");
      }
    } catch (e) {
      showToast("Terjadi kesalahan sistem.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      
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
            <Link href="/planner" className="text-sm font-bold text-emerald-600 border-b-2 border-emerald-500 pb-0.5 transition-colors">AI Planner</Link>
            <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Riwayat</Link>
            <Link href="/referensi" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Katalog</Link>
          </nav>

          <div className="flex items-center gap-3 z-20">
            <Link href="/profile" className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">Profil</Link>
            <button onClick={() => signOut()} className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-red-500 hover:text-white transition-colors shadow-sm">
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row pt-[73px] flex-1">
      {/* ================= PANEL KIRI: FORM SIDEBAR ================= */}
      <aside className="w-full lg:w-[400px] lg:h-[calc(100vh-73px)] lg:sticky lg:top-[73px] bg-white border-r border-slate-200 shadow-sm flex flex-col z-20">
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

            <AnimatePresence>
              {(formData.umur > 0 && (formData.umur < 19 || formData.umur > 49)) && (
                <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }} className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-medium text-rose-700 leading-relaxed"><strong>Batas Usia Tidak Valid:</strong> Sistem perhitungan kalori ini dirancang khusus untuk kelompok dewasa produktif (19-49 tahun) sesuai Peraturan Menteri Kesehatan RI No. 28 Tahun 2019 tentang Angka Kecukupan Gizi. Penggunaan di luar rentang usia tersebut memerlukan pengawasan dokter.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isTargetUnderweight && (
                <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }} className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-medium text-rose-700 leading-relaxed"><strong>Target Berat Tidak Valid:</strong> Target yang Anda masukkan menghasilkan Indeks Massa Tubuh (IMT) di bawah 18.5 (Kurus). Menurut standar klasifikasi IMT World Health Organization (WHO), penurunan berat badan hingga batas "underweight" tidak disarankan karena berisiko memicu malnutrisi, osteoporosis, dan penurunan imunitas.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {previewMetrics && (
                <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }} className="flex gap-4">
                  <div className={`flex-1 p-4 rounded-2xl border ${previewMetrics.bgColorClass} flex flex-col justify-center items-center relative overflow-hidden transition-all shadow-sm`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${previewMetrics.colorClass}`}>IMT: {previewMetrics.kategori}</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tight">{previewMetrics.bmi}</p>
                  </div>
                  <div className="flex-1 p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full pointer-events-none"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400 relative z-10">Berat Ideal (BBI)</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{previewMetrics.bbi}<span className="text-sm font-bold text-slate-400 ml-1">kg</span></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                  {derivedTargetDiet === 'turun' ? <span className="text-emerald-600 font-bold text-sm flex items-center gap-1.5"><ArrowDownToLine className="w-4 h-4"/> Penurunan Berat Badan</span> :
                   derivedTargetDiet === 'naik' ? <span className="text-sky-600 font-bold text-sm flex items-center gap-1.5"><ArrowUpToLine className="w-4 h-4"/> Peningkatan Berat Badan</span> :
                   <span className="text-slate-700 font-bold text-sm flex items-center gap-1.5"><Scale className="w-4 h-4"/> Mempertahankan Berat Badan</span>}
                </div>
              </div>
              <button type="button" onClick={handlePreview} title="Preview TDEE" className="text-slate-400 bg-slate-50 p-2.5 border border-slate-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                <Eye className="w-5 h-5"/>
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">Preferensi Makanan</label>
              <div className="flex flex-col gap-3">
                {[
                  { 
                    id: 'seimbang', 
                    label: 'Gizi Seimbang', 
                    desc: derivedTargetDiet === 'stabil' ? 'Sangat Disarankan untuk menjaga kebugaran tubuh secara keseluruhan.' : derivedTargetDiet === 'turun' ? 'Disarankan untuk defisit kalori harian yang aman dan nyaman.' : 'Proporsi makro ideal (50% Karbo, 20% Pro, 30% Lemak).',
                    icon: Apple 
                  },
                  { 
                    id: 'tinggi_protein', 
                    label: 'Tinggi Protein', 
                    desc: derivedTargetDiet === 'turun' ? 'Sangat Disarankan secara medis untuk mencegah penyusutan otot saat diet.' : derivedTargetDiet === 'naik' ? 'Sangat Disarankan untuk membangun massa otot secara signifikan.' : 'Sangat baik untuk perbaikan sel otot pasca olahraga.',
                    icon: Dumbbell 
                  },
                  { 
                    id: 'rendah_karbo', 
                    label: 'Rendah Karbohidrat', 
                    desc: derivedTargetDiet === 'turun' ? 'Sangat Disarankan untuk mengontrol sensitivitas insulin dan bakar lemak.' : 'Cocok untuk diet khusus mengurangi lonjakan gula darah harian.',
                    icon: Flame 
                  }
                ].map((opt) => (
                  <button type="button" key={opt.id} onClick={() => setFormData({...formData, preferensi: opt.id as any})}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${formData.preferensi === opt.id ? 'bg-emerald-50 border-emerald-200 shadow-sm ring-1 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                    <div className={`p-2 rounded-lg mt-0.5 ${formData.preferensi === opt.id ? 'bg-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
                      <opt.icon className={`w-4 h-4 ${formData.preferensi === opt.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${formData.preferensi === opt.id ? 'text-emerald-800' : 'text-slate-700'}`}>{opt.label}</span>
                      <span className={`text-[10px] sm:text-[11px] font-medium leading-relaxed mt-0.5 ${formData.preferensi === opt.id ? 'text-emerald-600' : 'text-slate-500'}`}>{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
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
            <PlanResult 
              hasil={hasil}
              biometrics={{ berat: formData.berat, target_berat: formData.target_berat || formData.berat }}
              derivedTargetDiet={derivedTargetDiet}
              onSave={() => setShowSaveModal(true)}
              session={session}
            />
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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Tingkat Metabolisme Basal (BMR)</p>
                  <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">Kalori yang dibakar tubuh walau kamu rebahan / tidur seharian (fungsi organ dasar).</p>
                  <p className="text-3xl font-black text-slate-800">{previewData.bmr} <span className="text-sm font-bold text-slate-400 ml-1">kcal</span></p>
                </div>
                <div className="bg-emerald-500 p-6 rounded-2xl border border-emerald-600 shadow-lg shadow-emerald-500/20 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-400 rounded-full blur-2xl"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 mb-1 relative z-10">Total Pengeluaran Energi Harian (TDEE)</p>
                  <p className="text-[11px] text-emerald-50 mb-3 leading-relaxed relative z-10">Total kalori asli yang kamu butuhkan setiap hari (BMR + gaya hidup & olahragamu).</p>
                  <p className="text-4xl font-black relative z-10 tracking-tight">{previewData.tdee} <span className="text-base font-bold text-emerald-200 tracking-normal ml-1">kcal</span></p>
                </div>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="w-full mt-8 py-4 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all relative z-10 shadow-lg active:scale-95">Tutup & Lanjutkan Form</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL SIMPAN PLAN ================= */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md p-8 relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] shadow-2xl text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5 relative z-10">
                <Save className="w-8 h-8 text-emerald-500" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2 relative z-10">Simpan Rencana Diet</h3>
              <p className="text-sm font-medium text-slate-500 mb-6 relative z-10">Beri nama untuk rencana diet ini agar mudah ditemukan nanti di Dashboard.</p>
              
              <div className="mb-8 relative z-10 text-left">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Nama Plan</label>
                <input 
                  type="text" 
                  placeholder="Misal: Diet Defisit Juni, Bulking Dada..." 
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 relative z-10">
                <button onClick={() => setShowSaveModal(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors">
                  Batal
                </button>
                <button onClick={handleSavePlan} className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white text-sm font-bold rounded-xl transition-all">
                  Simpan Sekarang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL DRAFT ================= */}
      <AnimatePresence>
        {showDraftModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md p-8 relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] shadow-2xl text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5 relative z-10">
                <Save className="w-8 h-8 text-emerald-500" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2 relative z-10">Draf Tersimpan Ditemukan</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 relative z-10">Kami menemukan sesi rencana nutrisi Anda yang belum selesai sebelumnya. Ingin melanjutkannya?</p>
              
              <div className="flex gap-3 relative z-10">
                <button onClick={handleClearDraft} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors">
                  Buat Baru
                </button>
                <button onClick={handleRestoreDraft} className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white text-sm font-bold rounded-xl transition-all">
                  Lanjutkan Draf
                </button>
              </div>
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
    </div>
  );
}
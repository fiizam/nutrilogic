"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Plus, TrendingDown, Calendar, Scale, Award, Trash2, Utensils, Flame, Info, Power } from "lucide-react";
import Link from "next/link";
import { HasilRekomendasi } from "@/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [progress, setProgress] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBerat, setNewBerat] = useState("");
  const [newKepatuhan, setNewKepatuhan] = useState(true);
  const [newCatatan, setNewCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [progRes, planRes] = await Promise.all([
        fetch("/api/progress"),
        fetch("/api/plans")
      ]);
      const progData = await progRes.json();
      const planData = await planRes.json();
      setProgress(progData.progress || []);
      setPlans(planData.plans || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBerat) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          berat: newBerat,
          kepatuhanDiet: newKepatuhan,
          catatanKondisi: newCatatan
        })
      });
      if (res.ok) {
        setNewBerat("");
        setNewKepatuhan(true);
        setNewCatatan("");
        fetchData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus plan ini?")) return;
    try {
      const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Activity className="w-8 h-8 text-emerald-500 animate-pulse" /></div>;
  }

  if (!session) return null;

  const latestPlan = plans.length > 0 ? JSON.parse(plans[0].data) as HasilRekomendasi : null;
  const currentBerat = progress.length > 0 ? progress[progress.length - 1].berat : (latestPlan ? null : 0);

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
            <Link href="/dashboard" className="text-sm font-bold text-emerald-600 border-b-2 border-emerald-500 pb-0.5 transition-colors">Riwayat</Link>
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

      <main className="max-w-5xl mx-auto px-6 sm:px-8 pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Riwayat Planner</h1>
          <p className="text-sm text-slate-500 mt-1">Lacak pencapaian target dan kelola rencana diet Anda di sini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mb-3 border border-sky-100">
              <Scale className="w-6 h-6 text-sky-500"/>
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Berat Saat Ini</p>
            <p className="text-3xl font-black text-slate-800">{currentBerat || '-'}<span className="text-sm font-bold text-slate-400 ml-1">kg</span></p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 border border-emerald-100">
              <TrendingDown className="w-6 h-6 text-emerald-500"/>
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Entri</p>
            <p className="text-3xl font-black text-slate-800">{progress.length}<span className="text-sm font-bold text-slate-400 ml-1">data</span></p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-emerald-300 transition-colors">
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 border border-emerald-100 relative z-10">
              <Award className="w-6 h-6 text-emerald-500"/>
            </div>
            <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-widest mb-1 relative z-10">Plan Aktif</p>
            <p className="text-2xl font-black text-slate-800 relative z-10">{latestPlan ? `${latestPlan.energi.tdeeTarget} kcal` : 'Belum Ada'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Progress Log */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 h-fit">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-indigo-500" /> Update Kondisi & Progress
            </h3>
            
            <form onSubmit={handleAddProgress} className="flex flex-col gap-4 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    placeholder="Berat badan saat ini" 
                    value={newBerat} 
                    onChange={(e) => setNewBerat(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KG</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="kepatuhan"
                  checked={newKepatuhan}
                  onChange={(e) => setNewKepatuhan(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 border-slate-300"
                />
                <label htmlFor="kepatuhan" className="text-sm font-medium text-slate-700">
                  Saya mematuhi Planner Diet hari ini
                </label>
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Catatan kondisi (opsional) - cth: Terasa lebih bugar" 
                  value={newCatatan} 
                  onChange={(e) => setNewCatatan(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1">
                <Plus className="w-4 h-4" /> Simpan Update
              </button>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {progress.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Belum ada data. Mulai lacak perkembangan Anda hari ini!</p>
              ) : (
                [...progress].reverse().map((p, i) => (
                  <div key={p.id} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">{progress.length - i}</div>
                        <span className="text-sm font-semibold text-slate-700">{new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <span className="text-lg font-black text-slate-900">{p.berat}<span className="text-xs font-bold text-slate-400 ml-1">kg</span></span>
                    </div>
                    {(p.kepatuhanDiet === false || p.catatanKondisi) && (
                      <div className="mt-2 text-xs font-medium text-slate-600 bg-white p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${p.kepatuhanDiet ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span>{p.kepatuhanDiet ? 'Mematuhi Planner' : 'Tidak mematuhi Planner'}</span>
                        </div>
                        {p.catatanKondisi && (
                          <p className="italic text-slate-500">"{p.catatanKondisi}"</p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Saved Plans */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-emerald-500" /> Riwayat Rencana Diet Lengkap
            </h3>
            
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
              {plans.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Anda belum pernah menyimpan rencana diet.</p>
              ) : (
                plans.map((plan) => {
                  const data = JSON.parse(plan.data) as HasilRekomendasi;
                  return (
                    <div key={plan.id} className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                      {/* Card Header */}
                      <div className="p-5 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3"/> {new Date(plan.createdAt).toLocaleDateString()}</span>
                          <button onClick={() => handleDeletePlan(plan.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Hapus Plan">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                          <div>
                            <p className="font-black text-slate-800 text-3xl">{data.energi.tdeeTarget} <span className="text-xs font-bold text-slate-400 uppercase">kkal/hari</span></p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mt-2 ${data.prediksi.warning ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{data.prediksi.kalori_harian_status}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skor Kesehatan</p>
                            <span className="font-black text-xl text-emerald-600">{data.holistic.ai_health_score}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Body - Foods */}
                      <div className="p-5 border-b border-slate-100">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5"/> Rekomendasi Menu</h4>
                        <div className="space-y-4">
                          {(['sarapan', 'siang', 'malam'] as const).map(sesi => {
                            // Support for both old format (object) and new format (array of options)
                            const sesiData = Array.isArray(data.menu[sesi]) ? (data.menu[sesi] as any[])[0] : data.menu[sesi];
                            return (
                            <div key={sesi}>
                              <p className="text-[11px] font-bold text-slate-700 capitalize mb-1">{sesi} <span className="text-slate-400 font-medium">({Math.round(sesiData?.totalKalori || 0)} kkal)</span></p>
                              {sesiData?.menu?.length > 0 ? (
                                <ul className="space-y-1">
                                  {sesiData.menu.map((m: any, idx: number) => (
                                    <li key={idx} className="text-xs text-slate-600 flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                      <span className="font-medium truncate mr-2">{m.nama_masakan}</span>
                                      <span className="font-bold text-slate-800 shrink-0">{m.kalori} kkal</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-slate-400 italic">Tidak ada menu</p>
                              )}
                            </div>
                          )})}
                        </div>
                      </div>

                      {/* Card Body - Workouts */}
                      <div className="p-5 border-b border-slate-100 bg-slate-50">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5"/> Rekomendasi Olahraga</h4>
                        {data.olahraga.length > 0 ? (
                          <div className="space-y-2">
                            {data.olahraga.map((ol, idx) => (
                              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs font-bold text-indigo-600 pr-2">{ol.nama}</span>
                                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">{ol.kategori}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 pb-2">
                                  <span>{ol.durasi_menit} menit</span>
                                  <span className="font-bold text-rose-500">~{ol.estimasi_kalori_terbakar} kkal</span>
                                </div>
                                <div className="text-[10px] text-slate-500 space-y-1">
                                  <p><span className="font-bold text-slate-600">Sumber:</span> {ol.sumber_validasi}</p>
                                  {ol.literatur && <p className="italic leading-relaxed line-clamp-2" title={ol.literatur}><span className="font-bold text-slate-600 not-italic">Jurnal:</span> {ol.literatur}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Tidak ada olahraga disarankan.</p>
                        )}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

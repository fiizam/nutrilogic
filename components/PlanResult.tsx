"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, TrendingDown, TrendingUp, AlertTriangle, 
  Info, Activity, Droplets, Moon, Award, Target, 
  Sparkles, Coffee, Utensils, Flame, LayoutDashboard, Apple, Dumbbell, Save, X
} from 'lucide-react';
import { HasilRekomendasi } from '@/types';
import Link from 'next/link';

interface PlanResultProps {
  hasil: HasilRekomendasi;
  biometrics: {
    berat: number;
    target_berat: number;
  };
  derivedTargetDiet: string;
  isSavedView?: boolean;
  onClose?: () => void;
  onSave?: () => void;
  session?: any;
}

export default function PlanResult({
  hasil,
  biometrics,
  derivedTargetDiet,
  isSavedView = false,
  onClose,
  onSave,
  session
}: PlanResultProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'workout'>('dashboard');
  const [activeMealTab, setActiveMealTab] = useState<'sarapan' | 'siang' | 'malam'>('sarapan');
  const [activeMealOption, setActiveMealOption] = useState<number>(0);

  const containerContent = (
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
        
        {isSavedView ? (
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all">
            <X className="w-4 h-4" /> Tutup
          </button>
        ) : (
          session ? (
            <button onClick={onSave} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all">
              <Save className="w-4 h-4" /> Simpan Plan
            </button>
          ) : (
            <Link href="/login" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all">
              <Save className="w-4 h-4" /> Login untuk Simpan
            </Link>
          )
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
                    <p className="font-black text-3xl text-slate-800">{biometrics.berat}<span className="text-sm font-bold text-slate-400 ml-1">kg</span></p>
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
                    <p className="font-black text-3xl text-slate-800">{biometrics.target_berat || biometrics.berat}<span className="text-sm font-bold text-slate-400 ml-1">kg</span></p>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-3"><Activity className="w-6 h-6 text-rose-500"/></div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1 text-center">IMT / Ideal ({hasil.energi.bmi_info.kategori})</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight">{hasil.energi.bmi_info.bmi} <span className="text-sm font-bold text-slate-400 ml-1">({hasil.energi.bmi_info.bbi}kg)</span></p>
                </div>
                <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center mb-3"><Droplets className="w-6 h-6 text-cyan-500"/></div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Target Hidrasi</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight">{hasil.holistic.air_liter} <span className="text-sm font-bold text-slate-400 ml-1">L</span></p>
                </div>
                <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3"><Moon className="w-6 h-6 text-indigo-500"/></div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Target Tidur</p>
                  <p className="text-lg font-bold text-slate-800 text-center">{hasil.holistic.tidur_jam}</p>
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
                  {[ { label: "Target Protein", val: (hasil.menu.sarapan[0].totalProtein+hasil.menu.siang[0].totalProtein+hasil.menu.malam[0].totalProtein), tar: hasil.macroTargets.protein, color: "bg-rose-500", bgTrack: "bg-rose-50" },
                     { label: "Target Lemak", val: (hasil.menu.sarapan[0].totalLemak+hasil.menu.siang[0].totalLemak+hasil.menu.malam[0].totalLemak), tar: hasil.macroTargets.lemak, color: "bg-amber-500", bgTrack: "bg-amber-50" },
                     { label: "Target Karbohidrat", val: (hasil.menu.sarapan[0].totalKarbo+hasil.menu.siang[0].totalKarbo+hasil.menu.malam[0].totalKarbo), tar: hasil.macroTargets.karbo, color: "bg-sky-500", bgTrack: "bg-sky-50" },
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
                    const options = hasil.menu[sesi] as any[];
                    const activeOption = options[activeMealOption] || options[0];
                    const targetSesi = Math.round(hasil.energi.tdeeTarget * (sesi === 'siang' ? 0.4 : 0.3));
                    const persentase = Math.min((activeOption.totalKalori / targetSesi) * 100, 100);

                    return (
                      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${persentase}%` }}></div>
                        <div className="p-6 lg:p-8">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-100 pb-5 gap-4">
                            <h5 className="text-xl font-bold text-slate-800 capitalize flex items-center gap-3">
                              <span className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                                {sesi === 'sarapan' ? <Coffee className="w-5 h-5 text-slate-500"/> : sesi === 'siang' ? <Utensils className="w-5 h-5 text-slate-500"/> : <Moon className="w-5 h-5 text-slate-500"/>}
                              </span> 
                              {sesi}
                            </h5>
                            
                            {/* TABS OPSI 1, 2, 3 */}
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                              {options.map((_, i) => (
                                <button 
                                  key={i}
                                  type="button"
                                  onClick={() => setActiveMealOption(i)}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${activeMealOption === i ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                  Opsi {i+1}
                                </button>
                              ))}
                            </div>
                            
                            <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm"><span className="text-lg font-black text-slate-800">{Math.round(activeOption.totalKalori)}</span><span className="text-[10px] uppercase font-bold text-slate-400 ml-1.5">/ {targetSesi} kcal</span></div>
                          </div>

                          <div className="space-y-4">
                            {activeOption.menu.length === 0 ? (
                               <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-medium text-slate-500 flex items-center gap-3"><Info className="w-5 h-5 text-slate-400"/> Tidak ada kandidat lolos filter CSP.</div>
                            ) : (
                              activeOption.menu.map((item: any, i: number) => (
                                <div key={i} className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl flex flex-col gap-4 hover:shadow-md hover:border-slate-300 transition-all">
                                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div>
                                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Kategori: {item.kategori}</span>
                                      <p className="font-bold text-slate-800 text-lg leading-tight mb-1.5">{item.nama_masakan}</p>
                                      <p className="text-sm font-medium text-slate-500">Porsi Tepat: <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{item.gramasi ? `${item.gramasi}g${item.urt_string ? ` (${item.urt_string})` : ''}` : item.ukuran_sajian}</span> <span className="mx-2 text-slate-300">•</span> Pro: {item.protein}g</p>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-center min-w-[100px]">
                                      <span className="font-black text-2xl text-slate-700 block">{item.kalori}</span>
                                      <span className="text-[10px] font-bold uppercase text-slate-400">kcal</span>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2 flex items-start gap-3">
                                    <Sparkles className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.alasan}</p>
                                  </div>
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
  );

  if (isSavedView) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-50/95 backdrop-blur-md overflow-y-auto w-full h-full">
        <div className="max-w-5xl mx-auto p-6 lg:p-10 pt-10 min-h-screen">
          {containerContent}
        </div>
      </div>
    );
  }

  return containerContent;
}

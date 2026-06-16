// src/app/katalog/page.tsx
'use client';

import { useState, useMemo } from 'react';
import tkpiDataRaw from '@/data/tkpi.json';
import { Makanan } from '@/types';
import { Search, Database } from 'lucide-react';

// Pemetaan data yang sama seperti di API (Karena JSON asli berbeda key)
interface RawTKPI {
  no: number;
  nama_bahan_pangan: string;
  kategori: string;
  kalori: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
}

const mappedTkpiData: Makanan[] = (tkpiDataRaw as unknown as RawTKPI[]).map((item) => ({
  id: item.no,
  nama: item.nama_bahan_pangan,
  kategori: item.kategori || 'Tanpa Kategori',
  kalori: item.kalori,
  protein: item.protein,
  lemak: item.lemak,
  karbohidrat: item.karbohidrat,
}));

export default function KatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fungsi Search Real-time (Case Insensitive)
  const filteredData = useMemo(() => {
    if (!searchTerm) return mappedTkpiData;
    return mappedTkpiData.filter(item => 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 space-y-12 animate-[fadeInUp_0.8s_ease-out_forwards]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-emerald-600 mb-4 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <Database className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Tabel Komposisi Pangan Indonesia</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Katalog Dataset
            </h1>
            <p className="mt-4 text-slate-500 font-medium leading-relaxed text-sm">
              Menampilkan {mappedTkpiData.length} data bahan pangan lokal Indonesia yang telah melalui tahap preprocessing dan siap digunakan dalam perhitungan algoritma AI.
            </p>
          </div>

          {/* Search Input Klasik */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari nama pangan atau kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 pl-12 py-3.5 text-sm font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400 transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Tabel Data Gaya Bersih */}
        <div className="w-full overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-widest w-16 text-center">ID</th>
                  <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-widest">Nama Pangan</th>
                  <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-widest hidden md:table-cell">Kategori</th>
                  <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-widest text-right text-emerald-600">Kalori (kkal)</th>
                  <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-widest text-right">Protein (g)</th>
                  <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-widest text-right">Lemak (g)</th>
                  <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-widest text-right">Karbo (g)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.slice(0, 100).map((item) => ( 
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-slate-400 text-center">{item.id}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-800">{item.nama}</td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500 hidden md:table-cell">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs">{item.kategori}</span>
                    </td>
                    <td className="py-4 px-6 text-base font-black text-emerald-600 text-right bg-emerald-50/30">{item.kalori}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">{item.protein}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">{item.lemak}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">{item.karbohidrat}</td>
                  </tr>
                ))}
                
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <Database className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-semibold">Data pangan tidak ditemukan.</p>
                      <p className="text-slate-400 text-sm mt-1">Coba gunakan kata kunci lain.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredData.length > 100 && (
            <div className="bg-slate-50 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200">
              Menampilkan 100 dari {filteredData.length} hasil (Gunakan pencarian untuk spesifik)
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
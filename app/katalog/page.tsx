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
    <div className="min-h-screen pt-12 pb-24 px-6 lg:px-12 relative">
      <div className="max-w-7xl mx-auto space-y-12 animate-[fadeInUp_0.8s_ease-out_forwards]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#0F2922]/20 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#C4A47C] mb-4">
              <Database className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Tabel Komposisi Pangan Indonesia</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#0F2922] leading-tight">
              Katalog <i className="italic font-light text-[#C4A47C]">Dataset</i>
            </h1>
            <p className="mt-4 text-[#0F2922]/60 font-light leading-relaxed">
              Menampilkan {mappedTkpiData.length} data bahan pangan lokal Indonesia yang telah melalui tahap preprocessing dan siap digunakan dalam perhitungan algoritma Greedy dan CSP.
            </p>
          </div>

          {/* Search Input Klasik */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-0 top-3 w-5 h-5 text-[#0F2922]/40 group-focus-within:text-[#0F2922] transition-colors" />
            <input 
              type="text" 
              placeholder="Cari nama pangan atau kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-[#0F2922]/20 focus:border-[#0F2922] focus:ring-0 pl-8 pb-2 pt-3 text-lg font-serif text-[#0F2922] placeholder:font-sans placeholder:text-sm placeholder:text-[#0F2922]/30 transition-colors"
            />
          </div>
        </div>

        {/* Tabel Data Gaya Editorial */}
        <div className="w-full overflow-x-auto bg-white border border-[#0F2922]/10 shadow-[10px_10px_0px_0px_rgba(15,41,34,0.05)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F2922] text-[#F9F8F6]">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest border-r border-[#F9F8F6]/10 w-16 text-center">ID</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest border-r border-[#F9F8F6]/10">Nama Pangan</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest border-r border-[#F9F8F6]/10 hidden md:table-cell">Kategori</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest border-r border-[#F9F8F6]/10 text-right text-[#C4A47C]">Kalori (kkal)</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest border-r border-[#F9F8F6]/10 text-right">Protein (g)</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest border-r border-[#F9F8F6]/10 text-right">Lemak (g)</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-right">Karbo (g)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 100).map((item, index) => ( // Tampilkan 100 data pertama agar tidak lag
                <tr key={item.id} className="border-b border-[#0F2922]/5 hover:bg-[#0F2922]/[0.02] transition-colors">
                  <td className="py-4 px-6 text-sm text-[#0F2922]/50 text-center">{item.id}</td>
                  <td className="py-4 px-6 font-medium text-[#0F2922]">{item.nama}</td>
                  <td className="py-4 px-6 text-sm text-[#0F2922]/60 hidden md:table-cell">{item.kategori}</td>
                  <td className="py-4 px-6 font-serif text-lg text-[#0F2922] text-right font-bold bg-[#C4A47C]/5">{item.kalori}</td>
                  <td className="py-4 px-6 text-sm text-[#0F2922]/80 text-right">{item.protein}</td>
                  <td className="py-4 px-6 text-sm text-[#0F2922]/80 text-right">{item.lemak}</td>
                  <td className="py-4 px-6 text-sm text-[#0F2922]/80 text-right">{item.karbohidrat}</td>
                </tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#0F2922]/40 font-serif text-lg">
                    Data pangan tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {filteredData.length > 100 && (
            <div className="bg-[#0F2922]/[0.02] py-4 text-center text-xs font-bold text-[#0F2922]/50 uppercase tracking-widest border-t border-[#0F2922]/10">
              Menampilkan 100 dari {filteredData.length} hasil (Gunakan pencarian untuk data spesifik)
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
// src/components/Footer.tsx
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050505] pt-16 pb-8 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#00FFB2]" />
            <span className="font-space font-bold text-lg text-white">NutriLogic</span>
          </div>
          <p className="text-neutral-500 text-sm max-w-sm">Sistem Optimasi Diet & Protokol Latihan Fisik Tingkat Lanjut menggunakan Algoritma Greedy dan CSP.</p>
        </div>
        <div className="text-left md:text-right text-sm text-neutral-600 space-y-1">
          <p className="text-neutral-300 font-medium">Muhammad Zamzari Alfi Syahrin</p>
          <p>NPM: 065122148 | Universitas Pakuan</p>
          <p>&copy; {new Date().getFullYear()} Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
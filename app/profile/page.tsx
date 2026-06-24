"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, User as UserIcon, Calendar, FileText, TrendingUp, LogOut, Power } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        setProfile(data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Activity className="w-8 h-8 text-emerald-500 animate-pulse" /></div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
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
            <Link href="/referensi" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Katalog</Link>
          </nav>

          <div className="flex items-center gap-3 z-20">
            <Link href="/profile" className="px-5 py-2.5 rounded-full text-sm font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors">Profil</Link>
            <button onClick={() => signOut()} className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-red-500 hover:text-white transition-colors shadow-sm">
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 sm:px-8 pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profil Pengguna</h1>
          <p className="text-sm text-slate-500 mt-1">Informasi detail akun Anda.</p>
        </div>

        {profile && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 flex flex-col items-center border-b border-slate-100 bg-slate-50/50">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                <UserIcon className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">{profile.name}</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">@{profile.username}</p>
            </div>
            
            <div className="p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Detail Akun</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tanggal Bergabung</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {new Date(profile.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Plan Dibuat</p>
                    <p className="text-sm font-semibold text-slate-800">{profile._count?.plans || 0} Plan</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Log Progress</p>
                    <p className="text-sm font-semibold text-slate-800">{profile._count?.progress || 0} Entri</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex justify-center">
                <button onClick={() => signOut()} className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 px-6 py-3 rounded-xl transition-colors">
                  <LogOut className="w-4 h-4" /> Keluar dari Akun
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

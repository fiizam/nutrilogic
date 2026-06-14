"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowRight, Loader2, User, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          username: formData.username,
          password: formData.password
        });
        
        if (res?.error) {
          setError("Username atau password salah.");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Pendaftaran gagal.");
        } else {
          // Auto login after register
          await signIn("credentials", {
            redirect: false,
            username: formData.username,
            password: formData.password
          });
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 group">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">Nutri<span className="text-emerald-500">Logic</span></span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          {isLogin ? "Masuk ke akun Anda" : "Buat akun baru"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
            {isLogin ? "Daftar sekarang" : "Masuk di sini"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:px-10 border border-slate-200">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
                  <input type="text" required={!isLogin} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold transition-all" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
                <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold transition-all" placeholder="johndoe" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold transition-all" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-emerald-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 mt-6 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? "Masuk" : "Daftar Akun")}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

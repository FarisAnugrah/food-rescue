"use client";

import { useState } from "react";
import Link from "next/link";
import { register, loginWithGoogle } from "@/lib/auth-actions";
import { Percent, Leaf, PackageOpen, BadgeDollarSign, HeartHandshake } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"consumer" | "merchant">("consumer");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await loginWithGoogle();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Banner */}
      <div className="hidden lg:flex w-1/2 flex-col bg-[#1b4332] p-10 xl:p-14 relative overflow-hidden h-screen">
        {/* Background gradient blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-[#2d6a4f] opacity-60 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#52b788] opacity-30 blur-[100px]"></div>

        {/* Decorative Floating Badges */}
        <div className="absolute top-[20%] xl:top-[25%] right-[10%] rotate-12 rounded-full bg-[#d8f3dc] px-4 py-2 flex items-center gap-1.5 text-xs font-bold text-[#1b4332] shadow-xl z-0 hidden sm:flex">
          <Percent className="w-3.5 h-3.5" /> 70% Off
        </div>
        <div className="absolute top-[50%] xl:top-[55%] right-[5%] -rotate-6 rounded-full bg-[#fefae0] px-4 py-2 flex items-center gap-1.5 text-xs font-bold text-[#92400e] shadow-xl z-0 hidden sm:flex">
          <Leaf className="w-3.5 h-3.5" /> Eco Friendly
        </div>
        <div className="absolute top-[65%] xl:top-[70%] right-[12%] rotate-3 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 flex items-center gap-1.5 text-xs font-bold text-white shadow-xl z-0 hidden sm:flex">
          <PackageOpen className="w-3.5 h-3.5" /> Surprise Bag
        </div>

        {/* Header */}
        <div className="relative z-10 shrink-0">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            food<span className="text-[#52b788]">rescue</span>
          </Link>
          <div className="mt-8 xl:mt-12">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Mulai langkah kecilmu<br />untuk bumi hari ini.
            </h2>
            <p className="mt-4 text-[#95d5b2] text-sm xl:text-base max-w-md leading-relaxed">
              Daftar secara gratis, telusuri makanan surplus di sekitarmu, dan selamatkan makanan lezat.
            </p>
          </div>
        </div>

        {/* Info Cards (Zig-zag) */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-4 xl:gap-5 my-8">
          <div className="self-start rounded-2xl bg-[#2d6a4f]/40 backdrop-blur-md border border-[#52b788]/30 p-4 xl:p-5 flex gap-4 items-start w-full max-w-[320px] transform -rotate-1 hover:rotate-0 transition-all shadow-lg">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#52b788] flex items-center justify-center text-lg">
              <BadgeDollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Hemat hingga 70%</h3>
              <p className="text-[#95d5b2] text-xs mt-1 leading-relaxed">Dapatkan makanan berkualitas dari brand favorit dengan harga jauh lebih murah.</p>
            </div>
          </div>
          
          <div className="self-center xl:ml-12 rounded-2xl bg-[#2d6a4f]/40 backdrop-blur-md border border-[#52b788]/30 p-4 xl:p-5 flex gap-4 items-start w-full max-w-[320px] transform rotate-2 hover:rotate-0 transition-all shadow-lg">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#52b788] flex items-center justify-center text-lg">
              <Leaf className="w-5 h-5 text-[#fefae0]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Kurangi Emisi CO₂</h3>
              <p className="text-[#95d5b2] text-xs mt-1 leading-relaxed">Setiap 1kg makanan yang diselamatkan mencegah 2.5kg CO₂ terbuang ke atmosfer.</p>
            </div>
          </div>

          <div className="self-start xl:ml-4 rounded-2xl bg-[#2d6a4f]/40 backdrop-blur-md border border-[#52b788]/30 p-4 xl:p-5 flex gap-4 items-start w-full max-w-[320px] transform -rotate-2 hover:rotate-0 transition-all shadow-lg">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#52b788] flex items-center justify-center text-lg">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Bantu Komunitas Lokal</h3>
              <p className="text-[#95d5b2] text-xs mt-1 leading-relaxed">Dukung merchant lokal mengurangi kerugian akibat makanan yang tidak terjual.</p>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="relative z-10 shrink-0 flex gap-8 border-t border-white/10 pt-6">
          <div>
            <p className="text-2xl xl:text-3xl font-bold text-white">850+</p>
            <p className="text-[10px] xl:text-xs text-[#95d5b2] mt-1 uppercase tracking-wider font-semibold">Food Heroes Bergabung</p>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 sm:px-16 xl:px-32 relative">
        <Link href="/" className="absolute top-8 left-8 text-sm font-medium text-[#888] hover:text-[#2d6a4f] transition-colors flex items-center gap-2">
          <span>←</span> Kembali ke Beranda
        </Link>
        
        <div className="w-full max-w-sm mx-auto space-y-8 mt-12 lg:mt-0">
          <div>
            <h1 className="text-3xl font-bold text-[#1b4332]">Buat akun baru</h1>
            <p className="mt-2 text-[#666]">Lengkapi data di bawah ini untuk mendaftar.</p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                {role === "consumer" ? "Nama Lengkap" : "Nama Toko / Restoran"}
              </label>
              <input
                name="name"
                type="text"
                placeholder={role === "consumer" ? "Andi Pratama" : "Bakery Makmur"}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm focus:border-black outline-none transition-colors bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Daftar Sebagai</label>
              <div className="flex gap-3">
                <label className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-4 py-3.5 bg-white cursor-pointer hover:border-black transition-all">
                  <input type="radio" name="role" value="consumer" checked={role === "consumer"} onChange={() => setRole("consumer")} className="accent-black w-4 h-4" />
                  <span className="text-sm font-bold text-gray-700">Konsumen</span>
                </label>
                <label className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-4 py-3.5 bg-white cursor-pointer hover:border-black transition-all">
                  <input type="radio" name="role" value="merchant" checked={role === "merchant"} onChange={() => setRole("merchant")} className="accent-black w-4 h-4" />
                  <span className="text-sm font-bold text-gray-700">Merchant</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                placeholder={role === "consumer" ? "nama@email.com" : "admin@namatoko.com"}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm focus:border-black outline-none transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm focus:border-black outline-none transition-colors bg-white"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black mt-4 py-4 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? "Loading..." : "Daftar Sekarang"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-gray-400 uppercase tracking-widest font-bold">Atau</span>
            </div>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full rounded-full border border-gray-200 bg-white py-4 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            Daftar dengan Google
          </button>

          <p className="text-center text-sm text-gray-500 font-medium">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="font-bold text-black hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

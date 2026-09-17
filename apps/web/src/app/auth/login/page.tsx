"use client";

import { useState } from "react";
import Link from "next/link";
import { login, loginWithGoogle } from "@/lib/auth-actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await login(formData);
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
    <div className="flex min-h-screen bg-[#fafaf7]">
      {/* Left Banner */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#1b4332] p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#d8f3dc] opacity-10">
           {/* Nanti image background letak sini: <Image src="..." layout="fill" objectFit="cover" /> */}
        </div>
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            food<span className="text-[#52b788]">rescue</span>
          </Link>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Setiap porsi makanan<br />layak diselamatkan.
          </h2>
          <p className="mt-4 text-[#95d5b2] text-lg max-w-md">
            Bergabunglah dengan ribuan food hero lainnya. Hemat uang, dan kurangi dampak buruk bagi bumi.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 sm:px-16 xl:px-32 relative">
        <Link href="/" className="absolute top-8 left-8 lg:hidden text-2xl font-bold tracking-tight text-[#1b4332]">
          food<span className="text-[#2d6a4f]">rescue</span>
        </Link>
        
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1b4332]">Selamat datang kembali</h1>
            <p className="mt-2 text-[#666]">Masuk ke akun untuk mulai rescue makanan hari ini.</p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                placeholder="nama@email.com"
                required
                className="w-full rounded-xl border border-[#e8e4d4] px-4 py-3.5 text-sm focus:border-[#2d6a4f] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f] transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-[#e8e4d4] px-4 py-3.5 text-sm focus:border-[#2d6a4f] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f] transition-all bg-white"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2d6a4f] mt-2 py-3.5 text-sm font-bold text-white hover:bg-[#1b4332] disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e8e4d4]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#fafaf7] px-4 text-[#888] uppercase tracking-widest font-medium">Atau</span>
            </div>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full rounded-xl border border-[#e8e4d4] bg-white py-3.5 text-sm font-bold text-[#555] hover:bg-[#f0ede0] disabled:opacity-50 transition-colors"
          >
            Lanjutkan dengan Google
          </button>

          <p className="text-center text-sm text-[#888]">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="font-bold text-[#2d6a4f] hover:underline">
              Daftar Gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

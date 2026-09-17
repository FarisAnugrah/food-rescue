"use client";

import { useState } from "react";
import Link from "next/link";
import { register, loginWithGoogle } from "@/lib/auth-actions";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#fafaf7]">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center mb-2">
          <Link href="/" className="text-sm font-medium text-[#888] hover:text-[#2d6a4f] transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1b4332]">
            food<span className="text-[#2d6a4f]">rescue</span>
          </h1>
          <p className="mt-1 text-sm text-[#555]">Buat akun baru</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Nama lengkap"
            required
            className="w-full rounded-xl border border-[#e8e4d4] px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-xl border border-[#e8e4d4] px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min. 6 karakter)"
            required
            minLength={6}
            className="w-full rounded-xl border border-[#e8e4d4] px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#2d6a4f] py-3.5 text-sm font-bold text-white hover:bg-[#1b4332] disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "Daftar"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400">atau</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full rounded-full border border-[#e8e4d4] py-3.5 text-sm font-semibold text-[#555] hover:bg-[#f0ede0] disabled:opacity-50 transition-colors"
        >
          Lanjutkan dengan Google
        </button>

        <p className="text-center text-sm text-[#888]">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-semibold text-[#2d6a4f] hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

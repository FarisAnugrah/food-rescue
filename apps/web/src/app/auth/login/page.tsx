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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Food Rescue</h1>
          <p className="mt-1 text-sm text-gray-500">Masuk ke akunmu</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Loading..." : "Masuk"}
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
          className="w-full rounded-lg border py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Lanjutkan dengan Google
        </button>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="font-medium text-primary">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}

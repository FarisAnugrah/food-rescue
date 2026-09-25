"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h2 className="text-2xl font-black text-gray-900 mb-4">Ups! Terjadi Kesalahan</h2>
      <p className="text-gray-500 mb-8 max-w-md">Maaf, ada masalah di sisi server kami. Silakan coba lagi dalam beberapa saat.</p>
      <button onClick={() => reset()} className="px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
        Coba Lagi
      </button>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h2 className="text-6xl font-black text-[#2d6a4f] mb-4">404</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h3>
      <p className="text-gray-500 mb-8">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      <Link href="/" className="px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
        Kembali ke Beranda
      </Link>
    </div>
  );
}

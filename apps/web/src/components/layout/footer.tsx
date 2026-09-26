import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col sm:flex-row justify-between gap-12 text-sm text-gray-500 font-medium">
        <div>
          <span className="text-lg font-black tracking-tight text-gray-900">
            Food<span className="text-[#2d6a4f]">Rescue</span>
          </span>
          <p className="mt-4 max-w-xs leading-relaxed">
            Platform marketplace food rescue Indonesia. Selamatkan makanan, kurangi limbah.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">Platform</span>
            <Link href="/#cara-kerja" className="hover:text-gray-900 transition-colors">Cara Kerja</Link>
            <Link href="/auth/register" className="hover:text-gray-900 transition-colors">Daftar Consumer</Link>
            <Link href="/auth/register" className="hover:text-gray-900 transition-colors">Daftar Merchant</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">Dampak</span>
            <Link href="/#dampak" className="hover:text-gray-900 transition-colors">Statistik</Link>
            <Link href="/#merchant" className="hover:text-gray-900 transition-colors">Untuk Merchant</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400 font-medium">
        &copy; {new Date().getFullYear()} Food Rescue Indonesia
      </div>
    </footer>
  );
}

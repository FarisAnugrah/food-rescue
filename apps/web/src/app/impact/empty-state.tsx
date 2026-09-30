import { Target } from "lucide-react";
import Link from "next/link";

export function ImpactEmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
      <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-gray-900 font-bold mb-2">Belum Ada Impact</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
        Setiap pesanan food rescue yang Anda selesaikan akan mengurangi emisi karbon. Mari mulai berdonasi ke lingkungan hari ini!
      </p>
      <Link href="/listings" className="text-sm font-bold bg-[#2d6a4f] text-white px-6 py-3 rounded-full hover:bg-[#1b4332] transition-colors">
        Mulai Selamatkan Makanan
      </Link>
    </div>
  );
}

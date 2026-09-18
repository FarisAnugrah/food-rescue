import Link from "next/link";
import { formatWeight } from "@food-rescue/shared";
import { getConsumerImpact } from "@/lib/enhanced-actions";
import { Award, ShoppingBag, Leaf, Utensils } from "lucide-react";
import NotificationBell from "@/components/notification-bell";

export const dynamic = "force-dynamic";

export default async function ImpactDashboard() {
  const { data: impact } = await getConsumerImpact();
  const i = impact || { total_kg: 0, total_co2: 0, total_orders: 0 };

  let badge = "Starter";
  if (i.total_kg >= 50) badge = "Master Rescuer";
  else if (i.total_kg >= 20) badge = "Advanced Hero";
  else if (i.total_kg >= 5) badge = "Food Saver";

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#1b4332]">
            food<span className="text-[#2d6a4f]">rescue</span>
          </Link>
          <div className="flex gap-2 items-center">
            <Link href="/listings" className="rounded-full px-4 py-2 text-sm font-medium text-[#555] hover:bg-[#d8f3dc] transition-colors">Browse</Link>
            <Link href="/orders" className="rounded-full px-4 py-2 text-sm font-medium text-[#555] hover:bg-[#d8f3dc] transition-colors">My Orders</Link>
            <div className="ml-1 flex items-center gap-2">
              <NotificationBell />
              <div className="h-4 w-px bg-[#e8e4d4] mx-1" />
              <Link href="/profile" className="text-sm font-medium text-[#555] hover:text-[#2d6a4f]">Profil</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332] mb-2">My Impact</h1>
        <p className="text-[#888] mb-8">Dampak positifmu untuk lingkungan</p>

        <div className="mb-8 rounded-3xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] p-8 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full bg-[#52b788] opacity-20 blur-3xl" />
          <h2 className="text-lg text-[#95d5b2] mb-4 font-medium">Badge Saat Ini</h2>
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            <Award className="w-8 h-8 text-[#d8f3dc]" />
          </div>
          <p className="text-3xl font-bold mb-2">{badge}</p>
          <p className="text-sm text-[#95d5b2] max-w-md mx-auto">
            Luar biasa! Kamu telah membuktikan bahwa tindakan kecil bisa membawa dampak besar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
          <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#d8f3dc] flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6 text-[#2d6a4f]" />
            </div>
            <p className="text-sm text-[#888]">Makanan Diselamatkan</p>
            <p className="mt-1 text-3xl font-bold text-[#1b4332]">{formatWeight(i.total_kg)}</p>
          </div>
          <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#fefae0] flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-[#92400e]" />
            </div>
            <p className="text-sm text-[#888]">CO₂ Dicegah</p>
            <p className="mt-1 text-3xl font-bold text-[#2d6a4f]">{formatWeight(i.total_co2)}</p>
          </div>
          <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#e8e4d4] flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-[#555]" />
            </div>
            <p className="text-sm text-[#888]">Total Order</p>
            <p className="mt-1 text-3xl font-bold text-[#1b4332]">{i.total_orders}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

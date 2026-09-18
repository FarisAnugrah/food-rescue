"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatWeight } from "@food-rescue/shared";
import { PackageOpen } from "lucide-react";
import NotificationBell from "@/components/notification-bell";
import type { Order } from "@food-rescue/shared";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-500",
  paid: "bg-[#fefae0] text-[#92400e]",
  picked_up: "bg-[#d8f3dc] text-[#2d6a4f]",
  expired: "bg-gray-100 text-gray-400",
  cancelled: "bg-red-50 text-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu Bayar",
  paid: "Siap Pickup",
  picked_up: "Selesai",
  expired: "Expired",
  cancelled: "Dibatalkan",
};

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [tab, setTab] = useState<"active" | "history">("active");

  const activeOrders = initialOrders.filter((o) => ["pending", "paid"].includes(o.status));
  const historyOrders = initialOrders.filter((o) => !["pending", "paid"].includes(o.status));

  const displayedOrders = tab === "active" ? activeOrders : historyOrders;

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#1b4332]">
            food<span className="text-[#2d6a4f]">rescue</span>
          </Link>
          <div className="flex gap-2 items-center">
            <Link href="/listings" className="rounded-full px-4 py-2 text-sm font-medium text-[#555] hover:bg-[#d8f3dc] transition-colors">Browse</Link>
            <Link href="/orders" className="rounded-full bg-[#2d6a4f] px-4 py-2 text-sm font-medium text-white">My Orders</Link>
            <div className="ml-1 flex items-center gap-2">
              <NotificationBell />
              <div className="h-4 w-px bg-[#e8e4d4] mx-1" />
              <Link href="/profile" className="text-sm font-medium text-[#555] hover:text-[#2d6a4f]">Profil</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1b4332] mb-2">Orderanku</h1>
            <p className="text-[#888]">Pantau pickup dan riwayat pesananmu</p>
          </div>
          
          <div className="flex bg-[#f0ede0] p-1 rounded-2xl w-fit">
            <button
              onClick={() => setTab("active")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === "active" ? "bg-white text-[#1b4332] shadow-sm" : "text-[#888] hover:text-[#555]"
              }`}
            >
              Aktif ({activeOrders.length})
            </button>
            <button
              onClick={() => setTab("history")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === "history" ? "bg-white text-[#1b4332] shadow-sm" : "text-[#888] hover:text-[#555]"
              }`}
            >
              Riwayat
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {displayedOrders.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-[#e8e4d4] rounded-3xl">
              <p className="text-[#888] font-medium mb-1">Belum ada pesanan {tab === "active" ? "aktif" : "di riwayat"}.</p>
              <Link href="/listings" className="text-[#2d6a4f] hover:underline text-sm">Mulai rescue makanan sekarang</Link>
            </div>
          ) : displayedOrders.map((o) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="rounded-2xl bg-white border border-[#e8e4d4] p-5 flex items-center justify-between hover:border-[#2d6a4f] hover:shadow-sm transition-all"
            >
              <div className="flex gap-4 items-start">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-[#f0ede0] flex items-center justify-center">
                  <PackageOpen className="w-7 h-7 text-[#92400e]" />
                </div>
                <div>
                  <p className="font-bold text-[#1b4332] text-sm">{o.listing_title}</p>
                  <p className="text-xs text-[#888]">{o.quantity} bag · {formatWeight(o.total_weight_kg)}</p>
                  <p className="text-xs text-[#aaa] mt-1">{new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#1b4332]">{formatCurrency(o.total_price)}</p>
                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[o.status]}`}>
                  {STATUS_LABELS[o.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { formatCurrency, formatWeight } from "@food-rescue/shared";
import { DUMMY_MERCHANT_ORDERS } from "@/lib/dummy-merchant";

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

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#1b4332]">
            food<span className="text-[#2d6a4f]">rescue</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/listings" className="rounded-full px-4 py-2 text-sm font-medium text-[#555] hover:bg-[#d8f3dc] transition-colors">Browse</Link>
            <Link href="/orders" className="rounded-full bg-[#2d6a4f] px-4 py-2 text-sm font-medium text-white">My Orders</Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332] mb-2">Orderanku</h1>
        <p className="text-[#888] mb-8">Riwayat & pickup</p>

        <div className="flex flex-col gap-4">
          {DUMMY_MERCHANT_ORDERS.map((o) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="rounded-2xl bg-white border border-[#e8e4d4] p-5 flex items-center justify-between hover:border-[#2d6a4f] hover:shadow-sm transition-all"
            >
              <div className="flex gap-4 items-start">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-[#f0ede0] flex items-center justify-center text-xl">
                  🍱
                </div>
                <div>
                  <p className="font-bold text-[#1b4332] text-sm">{o.listing_title}</p>
                  <p className="text-xs text-[#888]">{o.quantity} bag · {formatWeight(o.total_weight_kg)}</p>
                  <p className="text-xs text-[#aaa]">{new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
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

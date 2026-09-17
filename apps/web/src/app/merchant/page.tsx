import Link from "next/link";
import { formatCurrency, formatWeight, calculateCO2 } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { DUMMY_MERCHANT_STATS, DUMMY_MERCHANT_ORDERS } from "@/lib/dummy-merchant";
import { DUMMY_LISTINGS } from "@/lib/dummy-data";

const stats = DUMMY_MERCHANT_STATS;
const recentOrders = DUMMY_MERCHANT_ORDERS.filter((o) => o.status === "paid");
const activeListings = DUMMY_LISTINGS.filter((l) => l.status === "active").slice(0, 3);

export default function MerchantDashboard() {
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <MerchantNav active="/merchant" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332]">Dashboard</h1>
        <p className="mt-1 text-[#888]">Selamat datang kembali, Bakery Makmur</p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Makanan Diselamatkan", value: formatWeight(stats.total_kg_saved), color: "#2d6a4f" },
            { label: "CO₂ Dicegah", value: formatWeight(stats.total_co2_prevented), color: "#52b788" },
            { label: "Revenue Tambahan", value: formatCurrency(stats.total_revenue), color: "#1b4332" },
            { label: "Total Orders", value: stats.total_orders.toString(), color: "#2d6a4f" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
              <p className="text-xs text-[#888]">{s.label}</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1b4332]">Order Masuk</h2>
              <Link href="/merchant/orders" className="text-sm text-[#2d6a4f] font-medium hover:underline">Lihat semua</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-[#aaa]">Belum ada order masuk.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentOrders.map((o) => (
                  <div key={o.id} className="rounded-xl bg-white border border-[#e8e4d4] p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1b4332] text-sm">{o.listing_title}</p>
                      <p className="text-xs text-[#888]">{o.consumer_name} · {o.quantity} bag</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1b4332] text-sm">{formatCurrency(o.total_price)}</p>
                      <span className="rounded-full bg-[#fefae0] px-2 py-0.5 text-xs font-semibold text-[#1b4332]">
                        Menunggu pickup
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1b4332]">Listing Aktif</h2>
              <Link href="/merchant/listings" className="text-sm text-[#2d6a4f] font-medium hover:underline">Kelola</Link>
            </div>
            <div className="flex flex-col gap-3">
              {activeListings.map((l) => (
                <div key={l.id} className="rounded-xl bg-white border border-[#e8e4d4] p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1b4332] text-sm">{l.title}</p>
                    <p className="text-xs text-[#888]">Sisa {l.quantity - l.quantity_sold} / {l.quantity} bag</p>
                  </div>
                  <p className="font-bold text-[#2d6a4f] text-sm">{formatCurrency(l.discounted_price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

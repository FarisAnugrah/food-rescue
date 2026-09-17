import Link from "next/link";
import { formatCurrency, formatWeight } from "@food-rescue/shared";
import AdminNav from "@/components/admin/admin-nav";
import { DUMMY_PLATFORM_STATS, DUMMY_PENDING_MERCHANTS } from "@/lib/dummy-admin";

const s = DUMMY_PLATFORM_STATS;

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <AdminNav active="/admin" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332]">Admin Dashboard</h1>
        <p className="mt-1 text-[#888] mb-8">Platform overview</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Merchants", value: s.total_merchants, accent: false },
            { label: "Total Consumers", value: s.total_consumers, accent: false },
            { label: "Makanan Diselamatkan", value: formatWeight(s.total_kg_saved), accent: true },
            { label: "CO₂ Dicegah", value: formatWeight(s.total_co2_prevented), accent: true },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
              <p className="text-xs text-[#888]">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.accent ? "text-[#2d6a4f]" : "text-[#1b4332]"}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Orders", value: s.total_orders.toLocaleString() },
            { label: "Revenue Platform", value: formatCurrency(s.total_revenue) },
            { label: "Pending Approval", value: s.pending_merchants, warn: true },
            { label: "Flagged Listings", value: s.flagged_listings, warn: true },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
              <p className="text-xs text-[#888]">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${"warn" in stat && stat.warn ? "text-[#92400e]" : "text-[#1b4332]"}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1b4332]">Menunggu Approval</h2>
            <Link href="/admin/merchants" className="text-sm text-[#2d6a4f] font-medium hover:underline">Lihat semua</Link>
          </div>
          <div className="flex flex-col gap-3">
            {DUMMY_PENDING_MERCHANTS.map((m) => (
              <div key={m.id} className="rounded-xl bg-white border border-[#e8e4d4] p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1b4332] text-sm">{m.store_name}</p>
                  <p className="text-xs text-[#888]">{m.owner_name} · {m.address}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-[#2d6a4f] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1b4332] transition-colors">
                    Approve
                  </button>
                  <button className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

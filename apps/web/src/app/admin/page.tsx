import Link from "next/link";
import { formatCurrency, formatWeight } from "@food-rescue/shared";
import AdminNav from "@/components/admin/admin-nav";
import { getAdminDashboardStats, getPendingMerchants } from "@/lib/admin-queries";
import AdminActionButtons from "./admin-action-buttons";
import KtpPreview from "./ktp-preview";
import { requireRole } from "@/lib/auth-checks";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    await requireRole(["admin"]);
  }

  const { data: stats } = await getAdminDashboardStats();
  const { data: pendingMerchants } = await getPendingMerchants();

  const s = stats || { total_merchants: 0, total_consumers: 0, total_kg_saved: 0, total_co2_prevented: 0, total_orders: 0, total_revenue: 0, pending_merchants: 0, flagged_listings: 0 };

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
            { label: "Revenue Platform", value: formatCurrency(s.total_revenue), smText: true },
            { label: "Pending Approval", value: s.pending_merchants, warn: true },
            { label: "Flagged Listings", value: s.flagged_listings, warn: true },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
              <p className="text-xs text-[#888]">{stat.label}</p>
              <p className={`mt-1 font-bold ${stat.smText ? "text-lg" : "text-2xl"} ${"warn" in stat && stat.warn && stat.value > 0 ? "text-[#92400e]" : "text-[#1b4332]"}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1b4332]">Menunggu Approval</h2>
          </div>
          
          {pendingMerchants.length === 0 ? (
            <div className="rounded-xl border border-[#e8e4d4] bg-white p-8 text-center text-[#888]">
              Tidak ada merchant yang menunggu approval.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingMerchants.map((m: any) => (
                <div key={m.id} className="rounded-xl bg-white border border-[#e8e4d4] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-[#1b4332] text-sm">{m.store_name}</p>
                    <p className="text-xs text-[#888] mt-0.5">Pemilik: {m.owner_name || m.users?.name} ({m.users?.email})</p>
                    <p className="text-xs text-[#aaa] mt-1">{m.address}</p>
                    {m.ktp_url && <KtpPreview url={m.ktp_url} />}
                  </div>
                  <AdminActionButtons merchantId={m.id} userId={m.user_id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

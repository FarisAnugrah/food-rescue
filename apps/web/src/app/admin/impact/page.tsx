import { formatWeight, formatCurrency } from "@food-rescue/shared";
import AdminNav from "@/components/admin/admin-nav";
import { getAdminImpactDashboard } from "@/lib/admin-queries";

export const dynamic = "force-dynamic";

export default async function AdminImpact() {
  const { data } = await getAdminImpactDashboard();

  if (!data) return null;

  const { stats: s, chart: MONTHLY, topMerchants: TOP_MERCHANTS } = data;
  
  const maxKg = Math.max(...MONTHLY.map((m: any) => m.kg), 1);
  const maxTopKg = TOP_MERCHANTS.length > 0 ? TOP_MERCHANTS[0].kg : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav active="/admin/impact" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl mb-1">Impact Dashboard</h1>
        <p className="text-sm text-gray-500 mb-8">Dampak platform Food Rescue secara keseluruhan</p>

        <div className="grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl bg-[#1b4332] text-white p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2d6a4f] rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 opacity-50" />
            <p className="text-xs font-medium text-[#95d5b2] uppercase tracking-wide">Makanan Diselamatkan</p>
            <p className="mt-2 text-4xl font-black tracking-tight">{formatWeight(s.total_kg_saved)}</p>
            <p className="mt-2 text-xs font-semibold text-[#52b788]">~ {Math.round(s.total_kg_saved / 0.3)} porsi makan</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">CO₂ Dicegah</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-gray-900">{formatWeight(s.total_co2_prevented)}</p>
            <p className="mt-2 text-xs font-medium text-gray-400">~ {Math.round(s.total_co2_prevented / 21)} pohon ditanam</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Transaksi</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-gray-900">{s.total_orders.toLocaleString()}</p>
            <p className="mt-2 text-xs font-medium text-gray-400">Revenue: <span className="text-gray-900">{formatCurrency(s.total_revenue)}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-6">Makanan Diselamatkan per Bulan</h2>
            <div className="flex items-end gap-3 h-48 border-b border-gray-100 pb-2">
              {MONTHLY.map((d: any) => (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">{d.kg > 0 ? d.kg : ""}</span>
                  <div
                    className="w-full rounded-md bg-gray-200 group-hover:bg-[#1b4332] transition-colors"
                    style={{ height: `${(d.kg / maxKg) * 100}%`, minHeight: d.kg > 0 ? 8 : 4 }}
                  />
                  <span className="text-[11px] font-semibold text-gray-500">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-6">Top Merchant Rescuers</h2>
            <div className="flex flex-col gap-4">
              {TOP_MERCHANTS.length === 0 ? (
                <div className="text-center text-gray-400 py-10 text-sm font-medium">Belum ada data merchant</div>
              ) : TOP_MERCHANTS.map((m: any, i: number) => (
                <div key={m.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-black text-gray-300">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-bold text-gray-900">{m.name}</span>
                      <span className="text-xs font-black text-[#2d6a4f]">{m.kg} kg</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                      <div
                        className="h-1.5 rounded-full bg-[#1b4332]"
                        style={{ width: `${(m.kg / maxTopKg) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

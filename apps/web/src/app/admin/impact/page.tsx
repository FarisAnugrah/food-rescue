import { formatWeight, formatCurrency } from "@food-rescue/shared";
import AdminNav from "@/components/admin/admin-nav";
import { DUMMY_PLATFORM_STATS } from "@/lib/dummy-admin";

const s = DUMMY_PLATFORM_STATS;

const MONTHLY = [
  { month: "Apr", kg: 180 }, { month: "Mei", kg: 240 }, { month: "Jun", kg: 310 },
  { month: "Jul", kg: 420 }, { month: "Agu", kg: 580 }, { month: "Sep", kg: 426.8 },
];

const TOP_MERCHANTS = [
  { name: "Sushi Tei Express", kg: 203.1 },
  { name: "Bakery Makmur", kg: 127.5 },
  { name: "Warung Bu Sari", kg: 89.2 },
  { name: "Pizza Place", kg: 74.6 },
  { name: "Dapur Nusantara", kg: 63.3 },
];

const maxKg = Math.max(...MONTHLY.map((m) => m.kg));

export default function AdminImpact() {
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <AdminNav active="/admin/impact" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332] mb-2">Impact Dashboard</h1>
        <p className="text-[#888] mb-8">Dampak platform Food Rescue secara keseluruhan</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
          <div className="rounded-2xl bg-[#1b4332] text-white p-6">
            <p className="text-sm text-[#95d5b2]">Total Makanan Diselamatkan</p>
            <p className="mt-2 text-4xl font-bold">{formatWeight(s.total_kg_saved)}</p>
            <p className="mt-1 text-xs text-[#95d5b2]">Setara dengan {Math.round(s.total_kg_saved / 0.3)} porsi makan</p>
          </div>
          <div className="rounded-2xl bg-[#2d6a4f] text-white p-6">
            <p className="text-sm text-[#95d5b2]">CO₂ Dicegah</p>
            <p className="mt-2 text-4xl font-bold">{formatWeight(s.total_co2_prevented)}</p>
            <p className="mt-1 text-xs text-[#95d5b2]">Setara dengan {Math.round(s.total_co2_prevented / 21)} pohon ditanam</p>
          </div>
          <div className="rounded-2xl bg-[#52b788] text-[#1b4332] p-6">
            <p className="text-sm text-[#1b4332]/70">Total Transaksi</p>
            <p className="mt-2 text-4xl font-bold">{s.total_orders.toLocaleString()}</p>
            <p className="mt-1 text-xs text-[#1b4332]/70">Revenue: {formatCurrency(s.total_revenue)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6">
            <h2 className="text-lg font-bold text-[#1b4332] mb-6">Makanan Diselamatkan per Bulan</h2>
            <div className="flex items-end gap-3 h-48">
              {MONTHLY.map((d) => (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#1b4332]">{d.kg}</span>
                  <div
                    className="w-full rounded-lg bg-[#52b788] transition-all"
                    style={{ height: `${(d.kg / maxKg) * 100}%`, minHeight: 8 }}
                  />
                  <span className="text-xs text-[#888]">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6">
            <h2 className="text-lg font-bold text-[#1b4332] mb-6">Top Merchant Rescuers</h2>
            <div className="flex flex-col gap-3">
              {TOP_MERCHANTS.map((m, i) => (
                <div key={m.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-[#aaa]">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-[#1b4332]">{m.name}</span>
                      <span className="text-sm text-[#52b788] font-semibold">{m.kg} kg</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#f0ede0]">
                      <div
                        className="h-1.5 rounded-full bg-[#2d6a4f]"
                        style={{ width: `${(m.kg / TOP_MERCHANTS[0].kg) * 100}%` }}
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

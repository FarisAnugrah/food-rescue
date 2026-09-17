import { formatCurrency, formatWeight } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { DUMMY_MERCHANT_STATS } from "@/lib/dummy-merchant";

const stats = DUMMY_MERCHANT_STATS;

const WEEKLY_DATA = [
  { day: "Sen", kg: 12.5 },
  { day: "Sel", kg: 18.2 },
  { day: "Rab", kg: 15.0 },
  { day: "Kam", kg: 22.3 },
  { day: "Jum", kg: 28.1 },
  { day: "Sab", kg: 19.4 },
  { day: "Min", kg: 12.0 },
];

const maxKg = Math.max(...WEEKLY_DATA.map((d) => d.kg));

export default function MerchantAnalytics() {
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <MerchantNav active="/merchant/analytics" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332] mb-2">Analytics</h1>
        <p className="text-[#888] mb-8">Lihat dampak & performa tokomu</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
          {[
            { label: "Total Rescued", value: formatWeight(stats.total_kg_saved) },
            { label: "CO₂ Dicegah", value: formatWeight(stats.total_co2_prevented) },
            { label: "Revenue", value: formatCurrency(stats.total_revenue) },
            { label: "Rating", value: `${stats.rating} / 5` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
              <p className="text-xs text-[#888]">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-[#1b4332]">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6">
          <h2 className="text-lg font-bold text-[#1b4332] mb-6">Makanan Diselamatkan Minggu Ini</h2>
          <div className="flex items-end gap-3 h-48">
            {WEEKLY_DATA.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-[#1b4332]">{formatWeight(d.kg)}</span>
                <div
                  className="w-full rounded-lg bg-[#52b788] transition-all"
                  style={{ height: `${(d.kg / maxKg) * 100}%`, minHeight: 8 }}
                />
                <span className="text-xs text-[#888]">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-[#d8f3dc] border border-[#b7e4c7] p-6 flex items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2d6a4f] text-2xl">
            🏆
          </div>
          <div>
            <h3 className="font-bold text-[#1b4332]">Food Waste Warrior</h3>
            <p className="text-sm text-[#2d6a4f]">
              Kamu sudah menyelamatkan {formatWeight(stats.total_kg_saved)} makanan!
              Terus lanjutkan untuk naik level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatWeight } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { Medal } from "lucide-react";
import { getMerchantAnalytics } from "@/lib/analytics-queries";

export default function AnalyticsClient() {
  const [filter, setFilter] = useState<"week" | "month" | "all">("week");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMerchantAnalytics(filter).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [filter]);

  const stats = data?.stats || { total_kg_saved: 0, total_co2_prevented: 0, total_revenue: 0, total_orders: 0, rating: 0 };
  const chartData = data?.chart || [{ label: "-", kg: 0 }];
  
  const maxKg = Math.max(...chartData.map((d: any) => d.kg), 1); // fallback to 1 to avoid division by zero

  const filterLabels = {
    week: "7 Hari Terakhir",
    month: "30 Hari Terakhir",
    all: "Semua Waktu",
  };

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <MerchantNav active="/merchant/analytics" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1b4332] mb-2">Analytics</h1>
            <p className="text-[#888]">Lihat dampak & performa tokomu</p>
          </div>
          
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-xl border border-[#e8e4d4] bg-white px-4 py-2 text-sm font-medium text-[#1b4332] focus:border-[#2d6a4f] focus:outline-none"
          >
            <option value="week">7 Hari Terakhir</option>
            <option value="month">30 Hari Terakhir</option>
            <option value="all">Semua Waktu</option>
          </select>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-[#888]">Memuat data...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
              {[
                { label: `Total Order (${filterLabels[filter]})`, value: stats.total_orders },
                { label: `Revenue (${filterLabels[filter]})`, value: formatCurrency(stats.total_revenue) },
                { label: "Total Rescued (All Time)", value: formatWeight(stats.total_kg_saved) },
                { label: "Rating Toko", value: `${stats.rating} / 5` },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
                  <p className="text-xs text-[#888]">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-[#1b4332]">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6">
              <h2 className="text-lg font-bold text-[#1b4332] mb-6">Makanan Diselamatkan ({filterLabels[filter]})</h2>
              <div className="flex items-end gap-2 sm:gap-3 h-48 overflow-x-auto pb-2">
                {chartData.map((d: any) => (
                  <div key={d.label} className="flex flex-1 flex-col items-center gap-2 min-w-[40px]">
                    <span className="text-[10px] sm:text-xs font-semibold text-[#1b4332]">{d.kg > 0 ? formatWeight(d.kg) : ""}</span>
                    <div
                      className="w-full rounded-lg bg-[#52b788] transition-all duration-500"
                      style={{ height: `${(d.kg / maxKg) * 100}%`, minHeight: d.kg > 0 ? 8 : 4 }}
                    />
                    <span className="text-[10px] sm:text-xs text-[#888] text-center">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#d8f3dc] border border-[#b7e4c7] p-6 flex items-center gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2d6a4f]">
                <Medal className="w-8 h-8 text-[#d8f3dc]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1b4332]">Food Waste Warrior</h3>
                <p className="text-sm text-[#2d6a4f] mt-1 leading-relaxed">
                  Secara keseluruhan, kamu sudah menyelamatkan {formatWeight(stats.total_kg_saved)} makanan dan mencegah {formatWeight(stats.total_co2_prevented)} CO₂!
                  Terus lanjutkan untuk naik level.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { formatCurrency } from "@food-rescue/shared";

const STATUS_STYLES: Record<string, string> = {
  picked_up: "bg-[#d8f3dc] text-[#2d6a4f]",
  expired: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  picked_up: "Selesai",
  expired: "Expired",
  cancelled: "Dibatalkan",
};

export default function MerchantOrderHistory({ doneOrders }: { doneOrders: any[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  const displayed = doneOrders.slice(0, page * itemsPerPage);
  const hasMore = displayed.length < doneOrders.length;

  if (doneOrders.length === 0) return null;

  return (
    <>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-[#aaa] mb-4">
        Riwayat Selesai
      </h2>
      <div className="overflow-hidden rounded-2xl border border-[#e8e4d4] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8e4d4] text-left text-xs text-[#888] uppercase tracking-wider">
              <th className="px-5 py-4">Konsumen</th>
              <th className="px-5 py-4">Item</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((o) => (
              <tr key={o.id} className="border-b border-[#f0ede0] last:border-0 hover:bg-[#fafaf7] transition-colors">
                <td className="px-5 py-4 font-medium text-[#1b4332]">{o.consumer_name}</td>
                <td className="px-5 py-4 text-[#555]">{o.listing_title}</td>
                <td className="px-5 py-4 font-bold text-[#1b4332]">{formatCurrency(o.total_price)}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[o.status] || "bg-gray-100"}`}>
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setPage(p => p + 1)}
            className="rounded-full border border-[#e8e4d4] bg-white px-6 py-2.5 text-sm font-bold text-[#555] hover:bg-[#fafaf7] transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}
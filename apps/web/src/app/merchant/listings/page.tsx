import Link from "next/link";
import { formatCurrency } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { DUMMY_LISTINGS } from "@/lib/dummy-data";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-[#d8f3dc] text-[#2d6a4f]",
  sold_out: "bg-[#fefae0] text-[#92400e]",
  expired: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  sold_out: "Habis",
  expired: "Expired",
};

export default function MerchantListings() {
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <MerchantNav active="/merchant/listings" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1b4332]">Listings</h1>
            <p className="mt-1 text-[#888]">Kelola surplus makananmu</p>
          </div>
          <Link
            href="/merchant/listings/new"
            className="rounded-full bg-[#2d6a4f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1b4332] transition-colors"
          >
            + Listing Baru
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e8e4d4] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8e4d4] text-left text-xs text-[#888] uppercase tracking-wider">
                <th className="px-5 py-4">Nama</th>
                <th className="px-5 py-4">Harga</th>
                <th className="px-5 py-4">Stok</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Pickup</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_LISTINGS.map((l) => {
                const remaining = l.quantity - l.quantity_sold;
                const start = new Date(l.pickup_start).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                const end = new Date(l.pickup_end).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                return (
                  <tr key={l.id} className="border-b border-[#f0ede0] last:border-0 hover:bg-[#fafaf7]">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#1b4332]">{l.title}</p>
                      <p className="text-xs text-[#aaa]">{l.category} · {l.weight_kg} kg</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#1b4332]">{formatCurrency(l.discounted_price)}</p>
                      <p className="text-xs text-[#bbb] line-through">{formatCurrency(l.original_price)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className={`font-medium ${remaining <= 2 ? "text-red-500" : "text-[#1b4332]"}`}>
                        {remaining} / {l.quantity}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[l.status]}`}>
                        {STATUS_LABELS[l.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#888]">{start}–{end}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

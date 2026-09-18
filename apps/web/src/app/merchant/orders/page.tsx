import { formatCurrency } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { getMerchantOrders } from "@/lib/order-queries";
import { verifyOrder } from "@/lib/order-actions";
import MerchantScanner from "./merchant-scanner";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-[#fefae0] text-[#92400e]",
  picked_up: "bg-[#d8f3dc] text-[#2d6a4f]",
  expired: "bg-gray-100 text-gray-400",
  cancelled: "bg-red-50 text-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  paid: "Menunggu Pickup",
  picked_up: "Selesai",
  expired: "Expired",
  cancelled: "Dibatalkan",
};

export default async function MerchantOrders() {
  const { data: orders } = await getMerchantOrders();
  
  const pending = (orders || []).filter((o: any) => o.status === "paid");
  const done = (orders || []).filter((o: any) => o.status !== "paid");

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <MerchantNav active="/merchant/orders" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1b4332] mb-2">Orders</h1>
            <p className="text-[#888]">Scan QR saat konsumen pickup</p>
          </div>
          <MerchantScanner />
        </div>

        {pending.length > 0 && (
          <>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#52b788] mb-4">
              Menunggu Pickup ({pending.length})
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-10">
              {pending.map((o) => (
                <div key={o.id} className="rounded-2xl bg-white border border-[#e8e4d4] p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[#1b4332]">{o.listing_title}</p>
                      <p className="text-sm text-[#888]">{o.consumer_name} · {o.quantity} bag</p>
                    </div>
                    <p className="font-bold text-[#1b4332]">{formatCurrency(o.total_price)}</p>
                  </div>
                  <div className="rounded-xl bg-[#fefae0] px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#aaa]">Kode QR</p>
                      <p className="font-mono text-sm font-bold text-[#1b4332]">{o.qr_code}</p>
                    </div>
                    <form action={async () => {
                      "use server";
                      await verifyOrder(o.id);
                    }}>
                      <button type="submit" className="rounded-full bg-[#2d6a4f] px-4 py-2 text-xs font-bold text-white hover:bg-[#1b4332] transition-colors">
                        Verifikasi (Selesai)
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {done.length > 0 && (
          <>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#aaa] mb-4">
              Riwayat
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
                  {done.map((o) => (
                    <tr key={o.id} className="border-b border-[#f0ede0] last:border-0">
                      <td className="px-5 py-4 font-medium text-[#1b4332]">{o.consumer_name}</td>
                      <td className="px-5 py-4 text-[#555]">{o.listing_title}</td>
                      <td className="px-5 py-4 font-bold text-[#1b4332]">{formatCurrency(o.total_price)}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[o.status]}`}>
                          {STATUS_LABELS[o.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

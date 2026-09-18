import { formatCurrency } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { getMerchantOrders } from "@/lib/order-queries";
import { verifyOrder } from "@/lib/order-actions";
import MerchantScanner from "./merchant-scanner";
import MerchantOrderHistory from "./merchant-order-history";

export const dynamic = "force-dynamic";

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
          <div className="mt-8">
            <MerchantOrderHistory doneOrders={done} />
          </div>
        )}
      </div>
    </div>
  );
}

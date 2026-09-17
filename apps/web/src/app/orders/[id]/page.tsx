import { notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatWeight } from "@food-rescue/shared";
import { submitReview } from "@/lib/enhanced-actions";
import { getConsumerOrderById } from "@/lib/order-queries";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-[#fefae0] text-[#92400e]",
  picked_up: "bg-[#d8f3dc] text-[#2d6a4f]",
  expired: "bg-gray-100 text-gray-400",
  cancelled: "bg-red-50 text-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  paid: "Siap Pickup",
  picked_up: "Selesai",
  expired: "Expired",
  cancelled: "Dibatalkan",
};

export default async function OrderDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ success?: string }> }) {
  const { id } = await params;
  const { success } = await searchParams;

  const { data: order } = await getConsumerOrderById(id);
  if (!order) notFound();

  if (success === "true") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#fafaf7] px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d8f3dc] text-4xl">✓</div>
        <h1 className="text-2xl font-bold text-[#1b4332]">Pembayaran Berhasil!</h1>
        <p className="text-[#888] max-w-sm">Tunjukkan QR code di bawah ke merchant saat pickup.</p>
        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-8 flex flex-col items-center gap-4">
          <div className="h-48 w-48 rounded-xl bg-[#f0ede0] flex items-center justify-center">
            <span className="text-sm text-[#aaa]">[ QR Code ]</span>
          </div>
          <p className="font-mono text-lg font-bold text-[#1b4332]">{order.qr_code}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/orders" className="rounded-full border border-[#e8e4d4] px-6 py-3 text-sm font-medium text-[#1b4332] hover:bg-[#f0ede0]">
            Lihat Orderanku
          </Link>
          <Link href="/listings" className="rounded-full bg-[#2d6a4f] px-6 py-3 text-sm font-medium text-white hover:bg-[#1b4332]">
            Browse Lagi
          </Link>
        </div>
      </div>
    );
  }

  // Check if review exists (simulated via status for now, ideally check DB)
  const canReview = order.status === "picked_up";

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-6 py-4">
          <Link href="/orders" className="text-sm text-[#2d6a4f] font-medium hover:underline">← Orderanku</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1b4332]">Detail Order</h1>
          <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${STATUS_STYLES[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5 flex gap-4">
          <div className="h-16 w-16 shrink-0 rounded-xl bg-[#f0ede0] flex items-center justify-center text-2xl">🍱</div>
          <div>
            <h2 className="font-bold text-[#1b4332]">{order.listing_title}</h2>
            <p className="text-sm text-[#888]">{order.quantity} bag · {formatWeight(order.total_weight_kg)}</p>
            <p className="text-xs text-[#aaa] mt-1">
              Dipesan {new Date(order.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {order.status === "paid" && (
          <div className="rounded-2xl bg-[#fefae0] border border-[#e8e4d4] p-6 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-[#1b4332]">Tunjukkan QR ini ke merchant</p>
            <div className="h-48 w-48 rounded-xl bg-white border border-[#e8e4d4] flex items-center justify-center">
              <span className="text-sm text-[#aaa]">[ QR Code ]</span>
            </div>
            <p className="font-mono text-lg font-bold text-[#1b4332]">{order.qr_code}</p>
          </div>
        )}

        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#888]">Total Pembayaran</span>
            <span className="font-bold text-[#1b4332]">{formatCurrency(order.total_price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888]">Berat</span>
            <span className="text-[#1b4332]">{formatWeight(order.total_weight_kg)}</span>
          </div>
          {order.picked_up_at && (
            <div className="flex justify-between">
              <span className="text-[#888]">Diambil pada</span>
              <span className="text-[#2d6a4f]">
                {new Date(order.picked_up_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          )}
        </div>

        {canReview && (
          <div className="rounded-2xl bg-[#d8f3dc] border border-[#b7e4c7] p-6">
            <h3 className="font-bold text-[#1b4332] mb-2">Beri Ulasan</h3>
            <p className="text-sm text-[#2d6a4f] mb-4">Bagaimana kondisi makanan yang kamu ambil?</p>
            <form action={submitReview} className="flex flex-col gap-3">
              <input type="hidden" name="order_id" value={order.id} />
              <input type="hidden" name="merchant_id" value={order.merchant_id || "dummy_merchant"} />
              <select name="rating" required className="rounded-xl border border-[#e8e4d4] px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none">
                <option value="">Pilih Rating</option>
                <option value="5">⭐⭐⭐⭐⭐ Sangat Bagus</option>
                <option value="4">⭐⭐⭐⭐ Bagus</option>
                <option value="3">⭐⭐⭐ Cukup</option>
                <option value="2">⭐⭐ Kurang</option>
                <option value="1">⭐ Buruk</option>
              </select>
              <textarea name="comment" placeholder="Tulis komentar opsional..." rows={2} className="rounded-xl border border-[#e8e4d4] px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none resize-none" />
              <button type="submit" className="rounded-xl bg-[#2d6a4f] py-3 text-sm font-bold text-white hover:bg-[#1b4332] transition-colors mt-2">
                Kirim Ulasan
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

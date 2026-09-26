import { notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatWeight } from "@food-rescue/shared";
import { submitReview } from "@/lib/enhanced-actions";
import { getConsumerOrderById } from "@/lib/order-queries";
import { PackageOpen, CheckCircle } from "lucide-react";
import QRDownload from "@/components/orders/qr-download";
import QRCode from "react-qr-code";
import PaymentTimer from "@/components/orders/payment-timer";
import CopyButton from "@/components/orders/copy-button";

import { simulatePaymentSuccess } from "@/lib/order-actions";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600",
  paid: "bg-[#fefae0] text-[#92400e]",
  picked_up: "bg-[#d8f3dc] text-[#2d6a4f]",
  expired: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu Bayar",
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

  let hasReviewed = false;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data: reviewCheck } = await adminSupabase.from("reviews").select("id").eq("order_id", id).single();
    if (reviewCheck) hasReviewed = true;
  }

  if (success === "true") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#fafaf7] px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d8f3dc]">
          <CheckCircle className="w-10 h-10 text-[#2d6a4f]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1b4332]">Pembayaran Berhasil!</h1>
        <p className="text-[#888] max-w-sm">Tunjukkan QR code di bawah ke merchant saat pickup.</p>
        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-8 flex flex-col items-center gap-4">
          <div className="p-4 border-4 border-[#2d6a4f] rounded-xl bg-white flex items-center justify-center mx-auto w-fit">
             <QRCode value={order.qr_code} size={192} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
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

  const canReview = order.status === "picked_up" && !hasReviewed;

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
          <div className="h-16 w-16 shrink-0 rounded-xl bg-[#f0ede0] flex items-center justify-center">
            <PackageOpen className="w-8 h-8 text-[#92400e]" />
          </div>
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
            <div className="p-4 border-4 border-[#2d6a4f] rounded-xl bg-white flex items-center justify-center mx-auto w-fit">
              <QRCode value={order.qr_code} size={192} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
            </div>
            <p className="font-mono text-lg font-bold text-[#1b4332]">{order.qr_code}</p>
          </div>
        )}

        {order.status === "pending" && (
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6 flex flex-col items-center gap-4 text-center">
            <h3 className="font-bold text-orange-800">Menunggu Pembayaran</h3>
            <p className="text-sm text-orange-700 mt-[-8px] mb-2">Order Anda sudah tercatat namun statusnya belum lunas.</p>
            
            <PaymentTimer 
              createdAt={order.created_at} 
              durationMinutes={order.payment_method === "va_bca" ? 60 : order.payment_method === "ovo" ? 1 : 15} 
            />

            {order.payment_method === "qris" && order.payment_link && (
              <div className="mt-4">
                <QRDownload qrString={order.payment_link} filename={`QRIS-${order.qr_code}`} />
              </div>
            )}
            
            {order.payment_method === "va_bca" && order.va_number && (
              <div className="mt-4 bg-white p-4 rounded-xl border border-orange-200 w-full max-w-xs text-left">
                <p className="text-xs text-orange-800 uppercase tracking-widest font-semibold mb-1">Nomor VA BCA</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-mono font-bold text-orange-900 tracking-wider">{order.va_number}</p>
                  <CopyButton textToCopy={order.va_number} />
                </div>
              </div>
            )}
            
            {order.payment_method === "gopay" && order.payment_link && (
              <a href={order.payment_link} className="mt-4 w-full max-w-xs rounded-full bg-[#00AED6] py-3 text-sm font-bold text-white hover:bg-[#0092B3] transition-colors block text-center">
                Buka Aplikasi Gojek
              </a>
            )}

            {order.payment_method === "ovo" && (
               <p className="mt-2 text-sm font-bold text-[#4C2A86]">Cek aplikasi OVO Anda</p>
            )}

            <p className="text-xs text-orange-600/70 mt-2">Segera selesaikan sebelum expired.</p>
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
              <select name="rating" required className="w-full rounded-xl border border-[#e8e4d4] px-4 py-3 text-sm focus:border-[#2d6a4f] outline-none bg-white transition-colors">
                <option value="">Pilih Rating</option>
                <option value="5">5 Bintang (Sangat Bagus)</option>
                <option value="4">4 Bintang (Bagus)</option>
                <option value="3">3 Bintang (Cukup)</option>
                <option value="2">2 Bintang (Kurang)</option>
                <option value="1">1 Bintang (Buruk)</option>
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

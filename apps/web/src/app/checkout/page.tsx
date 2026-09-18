"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency, calculateDiscount } from "@food-rescue/shared";
import { getListingByIdAction } from "@/lib/listing-actions";
import { createOrder, simulatePaymentSuccess } from "@/lib/order-actions";
import { PackageOpen, Clock } from "lucide-react";
import QRCode from "react-qr-code";

const PAYMENT_METHODS = [
  { id: "gopay", label: "GoPay" },
  { id: "ovo", label: "OVO" },
  { id: "qris", label: "QRIS" },
  { id: "va_bca", label: "Virtual Account BCA" },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get("id");
  
  const [listing, setListing] = useState<any>(null);
  const [loadingListing, setLoadingListing] = useState(true);

  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState("gopay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrisOrder, setQrisOrder] = useState<string | null>(null);
  const [qrisString, setQrisString] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 menit

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (qrisOrder && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [qrisOrder, timeLeft]);

  useEffect(() => {
    if (!listingId) {
      router.push("/listings");
      return;
    }
    getListingByIdAction(listingId).then(({ data }) => {
      if (data) setListing(data);
      else router.push("/listings");
      setLoadingListing(false);
    });
  }, [listingId, router]);

  if (loadingListing || !listing) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const remaining = listing.quantity - listing.quantity_sold;
  const total = listing.discounted_price * qty;
  const saved = (listing.original_price - listing.discounted_price) * qty;
  const discount = calculateDiscount(listing.original_price, listing.discounted_price);
  const weightTotal = listing.weight_kg * qty;

  async function handlePay() {
    setLoading(true);
    setError("");
    
    const { data: orderId, invoiceUrl, qrisString: qrStringData, error: err } = await createOrder(listing.id, qty, total, weightTotal, method);
    
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    if (method === "qris") {
      setQrisOrder(orderId);
      setQrisString(qrStringData || `FR-QRIS-${orderId}-${total}`);
      setLoading(false);
      return;
    }

    if (invoiceUrl) {
      window.location.href = invoiceUrl; // Redirect to Xendit
    } else {
      router.push(`/orders/${orderId}?success=true`);
    }
  }

  if (qrisOrder) {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");

    return (
      <div className="min-h-screen bg-[#fafaf7] flex flex-col items-center justify-center px-4 pb-20">
        <div className="bg-white p-8 rounded-2xl border border-[#e8e4d4] flex flex-col items-center w-full max-w-sm text-center shadow-sm relative overflow-hidden">
          {timeLeft === 0 && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-red-600 mb-2">QRIS Kedaluwarsa</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#2d6a4f] text-white rounded-full text-sm font-bold mt-2">Ulangi Checkout</button>
            </div>
          )}
          
          <h2 className="font-bold text-xl text-[#1b4332] mb-2">Scan QRIS</h2>
          <div className="bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Selesaikan dalam {m}:{s}
          </div>
          <p className="text-sm text-[#888] mb-6">Buka aplikasi e-wallet atau m-banking Anda untuk memindai QR code ini.</p>
          
          <div className="p-4 border-4 border-[#2d6a4f] rounded-xl mb-6 bg-white flex items-center justify-center mx-auto w-fit">
            <div className={`w-48 h-48 flex items-center justify-center ${timeLeft === 0 ? "opacity-20" : ""}`}>
              <QRCode value={qrisString || `FR-QRIS-${qrisOrder}-${total}`} size={192} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
            </div>
          </div>
          
          <p className="font-bold text-2xl text-[#1b4332] mb-6">{formatCurrency(total)}</p>

          <button
            onClick={async () => {
              setLoading(true);
              await simulatePaymentSuccess(qrisOrder);
              router.push(`/orders/${qrisOrder}?success=true`);
            }}
            disabled={timeLeft === 0 || loading}
            className="w-full rounded-full bg-[#2d6a4f] py-4 text-sm font-bold text-white hover:bg-[#1b4332] transition-colors disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Simulasi: Saya Sudah Bayar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <Link href={`/listings/${listing.id}`} className="text-sm text-[#2d6a4f] font-medium hover:underline">
            ← Kembali
          </Link>
          <span className="text-base font-bold text-[#1b4332]">Checkout</span>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-10 flex flex-col gap-6">
        
        {/* Detail */}
        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5 flex gap-5 items-start">
          {listing.photo_url ? (
            <img src={listing.photo_url} alt={listing.title} className="h-20 w-20 shrink-0 rounded-xl object-cover border border-[#e8e4d4]" />
          ) : (
            <div className="h-20 w-20 shrink-0 rounded-xl bg-[#f0ede0] flex items-center justify-center">
              <PackageOpen className="w-8 h-8 text-[#92400e]" />
            </div>
          )}
          <div className="flex-1">
            <span className="inline-block px-2 py-1 mb-2 rounded bg-[#e8f5e9] text-xs font-semibold text-[#2d6a4f]">
              {listing.category} · Diskon {discount}%
            </span>
            <h2 className="text-base font-bold text-[#1b4332]">{listing.title}</h2>
            <p className="text-sm text-[#888]">{listing.merchant_name} · {listing.weight_kg} kg</p>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-sm text-[#bbb] line-through">{formatCurrency(listing.original_price)}</p>
              <p className="text-base font-bold text-[#1b4332]">{formatCurrency(listing.discounted_price)}</p>
            </div>
          </div>
        </div>

        {/* Jumlah */}
        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1b4332]">Jumlah Pesanan</h3>
            <p className="text-sm text-[#888] mt-1">Sisa {remaining} porsi tersedia</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-10 rounded-full border border-[#e8e4d4] text-xl font-bold text-[#1b4332] hover:bg-[#f0ede0] transition-colors flex items-center justify-center"
            >
              −
            </button>
            <span className="text-xl font-bold text-[#1b4332] w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(remaining, q + 1))}
              className="h-10 w-10 rounded-full border border-[#e8e4d4] text-xl font-bold text-[#1b4332] hover:bg-[#f0ede0] transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Pembayaran */}
        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
          <h3 className="font-bold text-[#1b4332] mb-4">Metode Pembayaran</h3>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`rounded-xl border py-3 text-sm font-semibold transition-colors flex flex-col gap-1 items-center justify-center ${
                  method === m.id
                    ? "border-[#2d6a4f] bg-[#d8f3dc] text-[#1b4332]"
                    : "border-[#e8e4d4] text-[#555] hover:border-[#2d6a4f]"
                }`}
              >
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ringkasan */}
        <div className="rounded-2xl bg-[#fefae0] border border-[#e8e4d4] p-5 flex flex-col gap-2">
          <h3 className="font-bold text-[#1b4332] border-b border-[#e8e4d4] pb-2 mb-1">Ringkasan Belanja</h3>
          <div className="flex justify-between text-[#888] text-sm mt-1">
            <span>Total harga ({qty} barang)</span>
            <span>{formatCurrency(listing.original_price * qty)}</span>
          </div>
          <div className="flex justify-between text-[#2d6a4f] text-sm font-medium">
            <span>Total Diskon</span>
            <span>−{formatCurrency(saved)}</span>
          </div>
          
          <div className="border-t border-[#e8e4d4] pt-3 mt-1 flex justify-between items-center">
            <span className="font-bold text-[#1b4332]">Total Tagihan</span>
            <span className="font-bold text-xl text-[#1b4332]">{formatCurrency(total)}</span>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full rounded-full bg-[#2d6a4f] py-4 text-sm font-bold text-white hover:bg-[#1b4332] transition-colors disabled:opacity-50 mt-2"
        >
          {loading ? "Memproses..." : `Bayar ${formatCurrency(total)}`}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}

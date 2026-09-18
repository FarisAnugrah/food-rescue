"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency, calculateDiscount } from "@food-rescue/shared";
import { getListingByIdAction } from "@/lib/listing-actions";
import { createOrder } from "@/lib/order-actions";
import { PackageOpen } from "lucide-react";

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
    
    const { data: orderId, invoiceUrl, error: err } = await createOrder(listing.id, qty, total, weightTotal);
    
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    if (method === "qris") {
      setQrisOrder(orderId);
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
    return (
      <div className="min-h-screen bg-[#fafaf7] flex flex-col items-center pt-20 px-4">
        <div className="bg-white p-8 rounded-2xl border border-[#e8e4d4] flex flex-col items-center w-full max-w-sm text-center shadow-sm">
          <h2 className="font-bold text-xl text-[#1b4332] mb-2">Scan QRIS</h2>
          <p className="text-sm text-[#888] mb-6">Buka aplikasi e-wallet atau m-banking Anda untuk memindai QR code ini.</p>
          
          <div className="p-4 border-4 border-[#2d6a4f] rounded-xl mb-6 bg-white inline-block">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=FR-QRIS-${qrisOrder}-${total}`} 
              alt="QRIS" 
              className="w-48 h-48"
            />
          </div>
          
          <p className="font-bold text-2xl text-[#1b4332] mb-6">{formatCurrency(total)}</p>

          <button
            onClick={() => router.push(`/orders/${qrisOrder}?success=true`)}
            className="w-full rounded-full bg-[#2d6a4f] py-4 text-sm font-bold text-white hover:bg-[#1b4332] transition-colors"
          >
            Simulasi: Saya Sudah Bayar
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

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Detail & Pembayaran */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5 flex gap-5 items-start">
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.title} className="h-24 w-24 shrink-0 rounded-xl object-cover border border-[#e8e4d4]" />
              ) : (
                <div className="h-24 w-24 shrink-0 rounded-xl bg-[#f0ede0] flex items-center justify-center">
                  <PackageOpen className="w-8 h-8 text-[#92400e]" />
                </div>
              )}
              <div className="flex-1 pt-1">
                <span className="inline-block px-2 py-1 mb-2 rounded bg-[#e8f5e9] text-xs font-semibold text-[#2d6a4f]">
                  {listing.category} · Diskon {discount}%
                </span>
                <h2 className="text-lg font-bold text-[#1b4332]">{listing.title}</h2>
                <p className="text-sm text-[#888] mt-1">{listing.merchant_name} · {listing.weight_kg} kg</p>
                <div className="mt-3 flex items-center gap-3">
                  <p className="text-sm text-[#bbb] line-through">{formatCurrency(listing.original_price)}</p>
                  <p className="text-lg font-bold text-[#1b4332]">{formatCurrency(listing.discounted_price)}</p>
                </div>
              </div>
            </div>

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

            <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
              <h3 className="font-bold text-[#1b4332] mb-4">Metode Pembayaran</h3>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`rounded-xl border p-4 text-left transition-colors flex flex-col gap-1 ${
                      method === m.id
                        ? "border-[#2d6a4f] bg-[#d8f3dc] text-[#1b4332]"
                        : "border-[#e8e4d4] text-[#555] hover:border-[#2d6a4f]"
                    }`}
                  >
                    <span className="text-sm font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Sticky */}
          <div className="md:col-span-1">
            <div className="sticky top-24 flex flex-col gap-4">
              <div className="rounded-2xl bg-[#fefae0] border border-[#e8e4d4] p-6 flex flex-col gap-3">
                <h3 className="font-bold text-[#1b4332] border-b border-[#e8e4d4] pb-3 mb-1">Ringkasan Belanja</h3>
                
                <div className="flex justify-between text-[#888] text-sm">
                  <span>Total harga ({qty} barang)</span>
                  <span>{formatCurrency(listing.original_price * qty)}</span>
                </div>
                <div className="flex justify-between text-[#2d6a4f] text-sm font-medium">
                  <span>Total Diskon</span>
                  <span>−{formatCurrency(saved)}</span>
                </div>
                
                <div className="border-t border-[#e8e4d4] pt-4 mt-2 flex justify-between items-center">
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
                className="w-full rounded-full bg-[#2d6a4f] py-4 text-sm font-bold text-white hover:bg-[#1b4332] transition-colors disabled:opacity-50"
              >
                {loading ? "Memproses..." : `Bayar ${formatCurrency(total)}`}
              </button>
            </div>
          </div>

        </div>
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

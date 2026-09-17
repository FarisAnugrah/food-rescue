"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency, calculateDiscount } from "@food-rescue/shared";
import { DUMMY_LISTINGS } from "@/lib/dummy-data";

const PAYMENT_METHODS = [
  { id: "gopay", label: "GoPay" },
  { id: "ovo", label: "OVO" },
  { id: "qris", label: "QRIS" },
  { id: "va_bca", label: "Virtual Account BCA" },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get("id") ?? "1";
  const listing = DUMMY_LISTINGS.find((l) => l.id === listingId) ?? DUMMY_LISTINGS[0];

  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState("gopay");
  const [loading, setLoading] = useState(false);

  const remaining = listing.quantity - listing.quantity_sold;
  const total = listing.discounted_price * qty;
  const saved = (listing.original_price - listing.discounted_price) * qty;
  const discount = calculateDiscount(listing.original_price, listing.discounted_price);

  function handlePay() {
    setLoading(true);
    setTimeout(() => {
      router.push("/orders/o-new?success=true");
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-6 py-4">
          <Link href={`/listings/${listing.id}`} className="text-sm text-[#2d6a4f] font-medium hover:underline">
            ← Kembali
          </Link>
          <span className="text-base font-bold text-[#1b4332]">Checkout</span>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-10 flex flex-col gap-6">
        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5 flex gap-4 items-start">
          <div className="h-20 w-20 shrink-0 rounded-xl bg-[#f0ede0] flex items-center justify-center">
            <span className="text-2xl">🍱</span>
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold text-[#52b788]">{listing.category} · -{discount}%</span>
            <h2 className="font-bold text-[#1b4332]">{listing.title}</h2>
            <p className="text-sm text-[#888]">{listing.merchant_name}</p>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-xs text-[#bbb] line-through">{formatCurrency(listing.original_price)}</p>
              <p className="font-bold text-[#1b4332]">{formatCurrency(listing.discounted_price)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
          <h3 className="font-bold text-[#1b4332] mb-4">Jumlah</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-10 rounded-full border border-[#e8e4d4] text-xl font-bold text-[#1b4332] hover:bg-[#f0ede0] transition-colors"
            >
              −
            </button>
            <span className="text-xl font-bold text-[#1b4332] w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(remaining, q + 1))}
              className="h-10 w-10 rounded-full border border-[#e8e4d4] text-xl font-bold text-[#1b4332] hover:bg-[#f0ede0] transition-colors"
            >
              +
            </button>
            <span className="text-sm text-[#888]">Sisa {remaining} bag</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
          <h3 className="font-bold text-[#1b4332] mb-4">Metode Pembayaran</h3>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`rounded-xl border py-3 text-sm font-semibold transition-colors ${
                  method === m.id
                    ? "border-[#2d6a4f] bg-[#d8f3dc] text-[#1b4332]"
                    : "border-[#e8e4d4] text-[#555] hover:border-[#2d6a4f]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#fefae0] border border-[#e8e4d4] p-5 flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-[#888]">
            <span>Harga asli × {qty}</span>
            <span>{formatCurrency(listing.original_price * qty)}</span>
          </div>
          <div className="flex justify-between text-[#2d6a4f] font-medium">
            <span>Diskon {discount}%</span>
            <span>−{formatCurrency(saved)}</span>
          </div>
          <div className="border-t border-[#e8e4d4] pt-2 mt-1 flex justify-between font-bold text-[#1b4332] text-base">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full rounded-full bg-[#2d6a4f] py-4 text-sm font-bold text-white hover:bg-[#1b4332] transition-colors disabled:opacity-50"
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@food-rescue/shared";
import { createClient } from "@supabase/supabase-js";

export default function ListingClientDetail({ 
  initialListing, 
  pickupStart, 
  pickupEnd 
}: { 
  initialListing: any, 
  pickupStart: string, 
  pickupEnd: string 
}) {
  const [listing, setListing] = useState(initialListing);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const channel = supabase
      .channel(`listing_detail_${listing.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "listings", filter: `id=eq.${listing.id}` },
        (payload) => {
          setListing({ ...listing, ...payload.new });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listing.id]);

  const remaining = listing.quantity - listing.quantity_sold;
  const isSoldOut = listing.status === "sold_out";
  const isExpired = listing.status === "expired" || new Date(listing.pickup_end) < new Date();

  return (
    <>
      <div className="flex flex-col gap-2 rounded-xl bg-[#fefae0] p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[#888]">Pickup window</span>
          <span className="font-medium text-[#1b4332]">{pickupStart} – {pickupEnd}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#888]">Estimasi berat</span>
          <span className="font-medium text-[#1b4332]">{listing.weight_kg} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#888]">Sisa tersedia</span>
          <span className={`font-medium ${remaining <= 2 && !isExpired ? "text-red-500" : "text-[#2d6a4f]"}`}>
            {isExpired ? "Expired" : isSoldOut ? "Habis" : `${remaining} bag`}
          </span>
        </div>
      </div>

      <div className="flex items-end gap-3">
        <div>
          <p className="text-sm text-[#bbb] line-through">{formatCurrency(listing.original_price)}</p>
          <p className="text-3xl font-bold text-[#1b4332]">{formatCurrency(listing.discounted_price)}</p>
        </div>
        <span className="mb-1 rounded-full bg-[#d8f3dc] px-3 py-1 text-xs font-bold text-[#2d6a4f]">
          Hemat {formatCurrency(listing.original_price - listing.discounted_price)}
        </span>
      </div>

      {isExpired ? (
        <button disabled className="w-full rounded-full bg-gray-300 py-4 text-sm font-bold text-gray-500 cursor-not-allowed">
          Waktu Pengambilan Telah Berakhir
        </button>
      ) : isSoldOut ? (
        <button disabled className="w-full rounded-full bg-[#2d6a4f] py-4 text-sm font-bold text-white opacity-40 cursor-not-allowed">
          Sold Out
        </button>
      ) : (
        <Link
          href={`/checkout?id=${listing.id}`}
          className="block w-full rounded-full bg-[#2d6a4f] py-4 text-sm font-bold text-white hover:bg-[#1b4332] transition-colors text-center"
        >
          Pesan Sekarang
        </Link>
      )}

      <p className="text-center text-xs text-[#aaa]">
        Bayar saat checkout via e-wallet atau QRIS
      </p>
    </>
  );
}
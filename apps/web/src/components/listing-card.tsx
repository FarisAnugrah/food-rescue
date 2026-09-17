import Link from "next/link";
import { formatCurrency, calculateDiscount } from "@food-rescue/shared";
import type { Listing } from "@food-rescue/shared";

interface Props {
  listing: Listing & { merchant_name: string; merchant_address: string };
}

export default function ListingCard({ listing }: Props) {
  const discount = calculateDiscount(listing.original_price, listing.discounted_price);
  const isSoldOut = listing.status === "sold_out";
  const remaining = listing.quantity - listing.quantity_sold;
  const pickupStart = new Date(listing.pickup_start).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const pickupEnd = new Date(listing.pickup_end).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <Link
      href={`/listings/${listing.id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[#e8e4d4] bg-white transition-all hover:border-[#2d6a4f] hover:shadow-lg ${isSoldOut ? "opacity-60" : ""}`}
    >
      <div className="relative aspect-[16/10] bg-[#f0ede0] flex items-center justify-center">
        <span className="text-sm text-[#aaa]">[ foto ]</span>
        <span className="absolute top-3 left-3 rounded-full bg-[#2d6a4f] px-3 py-1 text-xs font-bold text-white">
          -{discount}%
        </span>
        {listing.is_halal && (
          <span className="absolute top-3 right-3 rounded-full bg-[#d8f3dc] px-2.5 py-1 text-xs font-semibold text-[#2d6a4f]">
            Halal
          </span>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-[#1b4332]">Sold Out</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-[#52b788]">{listing.category}</p>
            <h3 className="mt-0.5 font-bold text-[#1b4332] leading-snug group-hover:text-[#2d6a4f]">
              {listing.title}
            </h3>
          </div>
          <span className="shrink-0 rounded-lg bg-[#fefae0] px-2 py-1 text-xs font-semibold text-[#1b4332]">
            {listing.weight_kg} kg
          </span>
        </div>

        <p className="text-xs text-[#888]">{listing.merchant_name}</p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-xs text-[#bbb] line-through">
              {formatCurrency(listing.original_price)}
            </p>
            <p className="text-lg font-bold text-[#1b4332]">
              {formatCurrency(listing.discounted_price)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#888]">
              Pickup {pickupStart}–{pickupEnd}
            </p>
            {!isSoldOut && (
              <p className="text-xs font-medium text-[#52b788]">
                Sisa {remaining} bag
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

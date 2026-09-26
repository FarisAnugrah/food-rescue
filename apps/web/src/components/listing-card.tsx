import Link from "next/link";
import { formatCurrency, calculateDiscount } from "@food-rescue/shared";
import type { Listing } from "@food-rescue/shared";
import { Image as ImageIcon } from "lucide-react";

interface Props {
  listing: Listing & { merchant_name: string; merchant_address: string };
  compact?: boolean;
}

export default function ListingCard({ listing, compact = false }: Props) {
  const discount = calculateDiscount(listing.original_price, listing.discounted_price);
  const remaining = Math.max(0, listing.quantity - listing.quantity_sold);
  const isSoldOut = listing.status === "sold_out" || remaining === 0;
  const pickupStart = new Date(listing.pickup_start).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const pickupEnd = new Date(listing.pickup_end).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <Link
      href={`/listings/${listing.id}`}
      className={`group flex flex-col overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-md shrink-0 ${compact ? "w-[240px] sm:w-[280px]" : ""} ${isSoldOut ? "opacity-60" : ""}`}
    >
      <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
        {listing.photo_url ? (
          <img src={listing.photo_url} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <ImageIcon className="w-10 h-10 text-gray-300" />
        )}
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-[#1b4332] px-3 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-md">
            -{discount}%
          </span>
          {listing.is_halal && (
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#1b4332] shadow-sm backdrop-blur-md">
              Halal
            </span>
          )}
        </div>
        
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="rounded-full bg-[#1b4332] px-5 py-2 text-sm font-bold text-white shadow-lg">Habis Terjual</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-[#2d6a4f] transition-colors line-clamp-2">
            {listing.title}
          </h3>
          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600">
            {listing.weight_kg} kg
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#52b788]">{listing.category}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-sm text-gray-500 truncate">{listing.merchant_name}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-dashed border-gray-200 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 line-through mb-0.5">
              {formatCurrency(listing.original_price)}
            </p>
            <p className={`${compact ? "text-lg" : "text-xl"} font-black text-gray-900 tracking-tight`}>
              {formatCurrency(listing.discounted_price)}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span>{pickupStart} - {pickupEnd}</span>
            </div>
            {!isSoldOut && (
              <p className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                Sisa {remaining}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

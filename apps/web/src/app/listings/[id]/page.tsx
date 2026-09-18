import { notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency, calculateDiscount } from "@food-rescue/shared";
import { getListingByIdQuery, getMerchantReviewsForConsumer } from "@/lib/listing-queries";
import { Image as ImageIcon, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: listing } = await getListingByIdQuery(id);

  if (!listing) notFound();

  const { data: reviews } = await getMerchantReviewsForConsumer(listing.merchant_id);

  const discount = calculateDiscount(listing.original_price, listing.discounted_price);
  const remaining = listing.quantity - listing.quantity_sold;
  const isSoldOut = listing.status === "sold_out";
  const isExpired = listing.status === "expired" || new Date(listing.pickup_end) < new Date();
  
  const pickupStart = new Date(listing.pickup_start).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const pickupEnd = new Date(listing.pickup_end).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <Link href="/listings" className="text-sm text-[#2d6a4f] font-medium hover:underline">
            ← Kembali
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-[#f0ede0] aspect-square flex items-center justify-center relative">
            {listing.photo_url ? (
              <img src={listing.photo_url} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-16 h-16 text-[#aaa]" />
            )}
            <span className="absolute top-4 left-4 rounded-full bg-[#2d6a4f] px-3 py-1.5 text-sm font-bold text-white">
              -{discount}%
            </span>
            {listing.is_halal && (
              <span className="absolute top-4 right-4 rounded-full bg-[#d8f3dc] px-3 py-1.5 text-sm font-semibold text-[#2d6a4f]">
                Halal
              </span>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <span className="text-sm font-semibold text-[#52b788]">{listing.category}</span>
              <h1 className="mt-1 text-2xl font-bold text-[#1b4332]">{listing.title}</h1>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-sm font-bold text-[#1b4332]">{listing.merchant_name}</p>
                <div className="flex items-center gap-1 rounded-full bg-[#fefae0] px-2 py-0.5 text-xs font-bold text-[#92400e]">
                  <Star className="w-3 h-3 fill-[#92400e]" />
                  <span>{listing.merchant_rating || "Baru"}</span>
                </div>
              </div>
              <p className="text-xs text-[#aaa] mt-1">{listing.merchant_address}</p>
            </div>

            <p className="text-sm leading-relaxed text-[#555]">{listing.description}</p>

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
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-10 border-t border-[#e8e4d4]">
          <h2 className="text-xl font-bold text-[#1b4332] mb-6">Ulasan Pembeli ({reviews.length})</h2>
          
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-[#e8e4d4] bg-white p-8 text-center text-[#888]">
              Belum ada ulasan untuk merchant ini. Jadilah yang pertama!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((r: any) => (
                <div key={r.id} className="rounded-2xl border border-[#e8e4d4] bg-white p-5 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#1b4332]">{r.user_name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-sm font-bold text-[#1b4332]">{r.rating}/5</span>
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-[#555] italic">"{r.comment}"</p>}
                  <span className="text-xs text-[#aaa] mt-1">
                    {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

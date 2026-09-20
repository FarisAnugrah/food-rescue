import Link from "next/link";
import { formatCurrency } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { getMerchantListings } from "@/lib/listing-queries";

import ListingRow from "./listing-row";

export const dynamic = "force-dynamic";

export default async function MerchantListings() {
  const { data: listings } = await getMerchantListings();

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <MerchantNav active="/merchant/listings" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1b4332]">Listings</h1>
            <p className="mt-1 text-[#888]">Kelola surplus makananmu</p>
          </div>
          <Link
            href="/merchant/listings/new"
            className="rounded-full bg-[#2d6a4f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1b4332] transition-colors"
          >
            + Listing Baru
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e8e4d4] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8e4d4] text-left text-xs text-[#888] uppercase tracking-wider">
                <th className="px-5 py-4">Item</th>
                <th className="px-5 py-4">Harga</th>
                <th className="px-5 py-4">Stok</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Pickup</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(listings || []).map((l: any) => (
                <ListingRow key={l.id} listing={l} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

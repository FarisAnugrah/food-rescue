import Link from "next/link";
import { formatCurrency } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { getMerchantListings } from "@/lib/listing-queries";

import ListingRow from "./listing-row";

export const dynamic = "force-dynamic";

export default async function MerchantListings() {
  const { data: listings } = await getMerchantListings();

  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantNav active="/merchant/listings" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Listings</h1>
            <p className="mt-1 text-sm text-gray-500">Kelola surplus makananmu</p>
          </div>
          <Link
            href="/merchant/listings/new"
            className="rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors w-fit"
          >
            + Listing Baru
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr className="border-b border-gray-200 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Item</th>
                  <th className="px-5 py-4">Harga</th>
                  <th className="px-5 py-4">Stok</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Pickup</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(listings || []).map((l: any) => (
                  <ListingRow key={l.id} listing={l} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

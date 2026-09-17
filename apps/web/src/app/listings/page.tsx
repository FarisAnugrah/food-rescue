import { getActiveListings } from "@/lib/listing-queries";
import ListingsClient from "./listings-client";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const { data: listings } = await getActiveListings();

  return <ListingsClient initialListings={listings || []} />;
}

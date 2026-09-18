import { getActiveListings } from "@/lib/listing-queries";
import ListingsClient from "./listings-client";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: listings } = await getActiveListings();

  return <ListingsClient initialListings={listings || []} user={user} />;
}

import { getActiveListings } from "@/lib/listing-queries";
import ListingsClient from "./listings-client";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth-checks";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  let user = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const auth = await requireRole(["consumer"]);
    user = auth.user;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const { data: listings } = await getActiveListings();

  return <ListingsClient initialListings={listings || []} user={user} />;
}

import { createClient } from "./supabase/server";

export async function getActiveListings() {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { DUMMY_LISTINGS } = await import("./dummy-data");
    return { data: DUMMY_LISTINGS, error: null };
  }

  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      merchants (
        store_name,
        address
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (data) {
    const transformed = data.map((d: any) => ({
      ...d,
      merchant_name: d.merchants?.store_name || "Unknown Merchant",
      merchant_address: d.merchants?.address || "-",
    }));
    return { data: transformed, error: null };
  }

  return { data: null, error: error?.message };
}

export async function getListingByIdQuery(id: string) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { DUMMY_LISTINGS } = await import("./dummy-data");
    return { data: DUMMY_LISTINGS.find((l: any) => l.id === id) || null, error: null };
  }

  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      merchants (
        store_name,
        address
      )
    `)
    .eq("id", id)
    .single();

  if (data) {
    const transformed = {
      ...data,
      merchant_name: data.merchants?.store_name,
      merchant_address: data.merchants?.address,
    };
    return { data: transformed, error: null };
  }

  return { data: null, error: error?.message };
}

export async function getMerchantListings() {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { DUMMY_LISTINGS } = await import("./dummy-data");
    return { data: DUMMY_LISTINGS, error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!merchant) return { data: null, error: "Merchant profile not found" };

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("merchant_id", merchant.id)
    .order("created_at", { ascending: false });

  return { data, error: error?.message };
}

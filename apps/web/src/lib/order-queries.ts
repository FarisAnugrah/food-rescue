import { createClient } from "./supabase/server";

// Helper function to lazily trigger expiration
async function triggerAutoExpire(supabase: any) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await supabase.rpc("auto_expire_orders");
    } catch (e) {
      // ignore
    }
  }
}

export async function getConsumerOrders() {
  const supabase = await createClient();
  await triggerAutoExpire(supabase);
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { data: [], error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      listings (
        title
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (data) {
    const transformed = data.map((d: any) => ({
      ...d,
      listing_title: d.listings?.title || "Unknown Listing",
    }));
    return { data: transformed, error: null };
  }

  return { data: null, error: error?.message };
}

export async function getConsumerOrderById(id: string) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    if (id.startsWith("o-")) return { data: { id, status: "paid", qr_code: "FR-DUMMY", listing_title: "Sample Order", total_weight_kg: 1.5, quantity: 1, total_price: 25000, created_at: new Date().toISOString() }, error: null };
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      listings (
        title,
        merchant_id
      ),
      reviews ( id )
    `)
    .eq("id", id)
    .single();

  if (data) {
    const transformed = {
      ...data,
      listing_title: data.listings?.title,
      merchant_id: data.listings?.merchant_id,
      has_review: data.reviews && data.reviews.length > 0,
    };
    return { data: transformed, error: null };
  }

  return { data: null, error: error?.message };
}

export async function getMerchantOrders() {
  const supabase = await createClient();
  await triggerAutoExpire(supabase);
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { data: [], error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!merchant) return { data: null, error: "Merchant profile not found" };

  // Ambil orders yang nyambung ke listing merchant ini
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      users ( name ),
      listings!inner ( title, merchant_id )
    `)
    .eq("listings.merchant_id", merchant.id)
    .order("created_at", { ascending: false });

  if (data) {
    const transformed = data.map((d: any) => ({
      ...d,
      listing_title: d.listings?.title || "Unknown Listing",
      consumer_name: d.users?.name || "Unknown Consumer",
    }));
    return { data: transformed, error: null };
  }

  return { data: null, error: error?.message };
}

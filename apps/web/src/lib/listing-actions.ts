"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function createListing(formData: FormData) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!merchant) return { error: "Merchant profile not found" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const is_halal = formData.get("is_halal") === "true";
  const original_price = parseInt(formData.get("original_price") as string);
  const discounted_price = parseInt(formData.get("discounted_price") as string);
  const weight_kg = parseFloat(formData.get("weight_kg") as string);
  const quantity = parseInt(formData.get("quantity") as string);
  
  const today = new Date().toISOString().split('T')[0];
  const startTime = formData.get("pickup_start") as string;
  const endTime = formData.get("pickup_end") as string;
  
  const pickup_start = new Date(`${today}T${startTime}:00`).toISOString();
  const pickup_end = new Date(`${today}T${endTime}:00`).toISOString();

  const type = formData.get("type") as any || "surprise_bag";

  const { error } = await supabase
    .from("listings")
    .insert({
      merchant_id: merchant.id,
      title,
      description,
      category,
      is_halal,
      original_price,
      discounted_price,
      weight_kg,
      quantity,
      pickup_start,
      pickup_end,
      type,
      status: "active"
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/merchant/listings");
  revalidatePath("/listings");
  return { error: null };
}

export async function getListingByIdAction(id: string) {
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

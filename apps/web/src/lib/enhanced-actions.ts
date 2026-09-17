"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function getConsumerImpact() {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { data: { total_kg: 8.5, total_co2: 21.25, total_orders: 5 }, error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("orders")
    .select("total_weight_kg")
    .eq("user_id", user.id)
    .eq("status", "picked_up");

  if (error) return { data: null, error: error.message };

  const total_kg = data.reduce((sum, order) => sum + Number(order.total_weight_kg), 0);
  const total_co2 = total_kg * 2.5;
  const total_orders = data.length;

  return { data: { total_kg, total_co2, total_orders }, error: null };
}

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const order_id = formData.get("order_id") as string;
  const merchant_id = formData.get("merchant_id") as string;
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  const { error } = await supabase
    .from("reviews")
    .insert({
      order_id,
      user_id: user.id,
      merchant_id,
      rating,
      comment
    });

  if (error) return;

  // Recalculate merchant rating
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("merchant_id", merchant_id);

  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await supabase
      .from("merchants")
      .update({ rating: parseFloat(avgRating.toFixed(1)) })
      .eq("id", merchant_id);
  }

  revalidatePath(`/orders/${order_id}`);
  revalidatePath(`/merchant/analytics`);
}

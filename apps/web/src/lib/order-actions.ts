"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function createOrder(listingId: string, quantity: number, totalPrice: number, totalWeightKg: number) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Generate dummy id
    const dummyId = "o-" + Math.random().toString(36).substr(2, 9);
    return { data: dummyId, error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Unauthorized" };

  // Generate unique QR string (e.g. FR-ABCD-1234)
  const qrCode = "FR-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);

  // Note: Dalam production sungguhan, kita harus pakai Postgres Transaction / RPC
  // untuk kurangi stock & bikin order secara atomic supaya tidak race condition.
  // Untuk MVP, kita pakai dua request.
  
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      listing_id: listingId,
      quantity,
      total_price: totalPrice,
      total_weight_kg: totalWeightKg,
      qr_code: qrCode,
      status: "paid" // Harusnya pending lalu nunggu Midtrans callback. Untuk MVP kita langsung anggap paid.
    })
    .select("id")
    .single();

  if (error) return { data: null, error: error.message };

  // Reduce stock
  await supabase.rpc('increment_sold', { x_listing_id: listingId, x_qty: quantity });

  revalidatePath("/orders");
  revalidatePath(`/listings/${listingId}`);
  
  return { data: order.id, error: null };
}

export async function verifyOrder(orderId: string) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Update order status
  const { data: order, error } = await supabase
    .from("orders")
    .update({ 
      status: "picked_up",
      picked_up_at: new Date().toISOString()
    })
    .eq("id", orderId)
    .select("id, total_weight_kg")
    .single();

  if (error) return { error: error.message };

  // Insert impact log
  const co2Prevented = order.total_weight_kg * 2.5; // Formula CO2
  await supabase
    .from("impact_logs")
    .insert({
      order_id: order.id,
      food_kg: order.total_weight_kg,
      co2_kg: co2Prevented
    });

  revalidatePath("/merchant/orders");
  revalidatePath("/merchant/analytics");
  return { error: null };
}

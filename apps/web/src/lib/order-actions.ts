"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import { Invoice } from "./xendit";

export async function createOrder(listingId: string, quantity: number, totalPrice: number, totalWeightKg: number) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.XENDIT_SECRET_KEY) {
    // Generate dummy id & dummy invoice URL
    const dummyId = "o-" + Math.random().toString(36).substr(2, 9);
    return { data: dummyId, invoiceUrl: `/orders/${dummyId}?success=true`, error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, invoiceUrl: null, error: "Unauthorized" };

  // Get user details for invoice
  const { data: userData } = await supabase.from("users").select("name, email").eq("id", user.id).single();

  const qrCode = "FR-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
  
  // 1. Create order di DB dengan status PENDING
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      listing_id: listingId,
      quantity,
      total_price: totalPrice,
      total_weight_kg: totalWeightKg,
      qr_code: qrCode,
      status: "pending" 
    })
    .select("id")
    .single();

  if (error) return { data: null, invoiceUrl: null, error: error.message };

  // 2. Reduce stock temporarily (kalau invoice expired nanti harus dikembalikan)
  await supabase.rpc('increment_sold', { x_listing_id: listingId, x_qty: quantity });

  // 3. Create Xendit Invoice
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    const invoice = await Invoice.createInvoice({
      data: {
        externalId: order.id,
        amount: totalPrice,
        description: `Food Rescue Order - ${quantity} bag(s)`,
        customer: {
          givenNames: userData?.name || "Consumer",
          email: userData?.email || user.email,
        },
        successRedirectUrl: `${siteUrl}/orders/${order.id}?success=true`,
        failureRedirectUrl: `${siteUrl}/checkout?id=${listingId}&error=payment_failed`,
        currency: "IDR",
        invoiceDuration: 1800, // 30 mins
      }
    });

    return { data: order.id, invoiceUrl: invoice.invoiceUrl, error: null };
  } catch (err: any) {
    // Revert if payment creation fails
    await supabase.from("orders").delete().eq("id", order.id);
    await supabase.rpc('increment_sold', { x_listing_id: listingId, x_qty: -quantity });
    return { data: null, invoiceUrl: null, error: "Gagal membuat pembayaran" };
  }
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

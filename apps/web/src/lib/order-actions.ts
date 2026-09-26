"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import { Invoice } from "./xendit";

import { createNotification } from "./notification-actions";

export async function createOrder(listingId: string, quantity: number, totalPrice: number, totalWeightKg: number, method: string = "gopay", ovoPhone?: string) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.XENDIT_SECRET_KEY) {
    // Generate dummy id & dummy invoice URL
    const dummyId = "o-" + Math.random().toString(36).substr(2, 9);
    return { data: dummyId, invoiceUrl: `/orders/${dummyId}?success=true`, error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, invoiceUrl: null, error: "Unauthorized" };

  // 0. Verify stock availability
  const { data: targetListing } = await supabase.from("listings").select("quantity, quantity_sold, pickup_end").eq("id", listingId).single();
  if (!targetListing) return { data: null, invoiceUrl: null, error: "Makanan tidak ditemukan" };
  if (new Date() > new Date(targetListing.pickup_end)) return { data: null, invoiceUrl: null, error: "Waktu pickup telah berakhir" };
  if (targetListing.quantity - targetListing.quantity_sold < quantity) return { data: null, invoiceUrl: null, error: "Stok makanan tidak cukup" };

  // Get user details for invoice
  const { data: userData } = await supabase.from("users").select("name, email").eq("id", user.id).single();

  const qrCode = "FR-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
  
  const platformFee = 2000;
  const grandTotal = totalPrice + platformFee;
  
  // 1. Create order di DB dengan status PENDING
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      listing_id: listingId,
      quantity,
      total_price: totalPrice, // Merchant revenue
      total_weight_kg: totalWeightKg,
      qr_code: qrCode,
      status: "pending",
      payment_method: method
      // Note: Make sure to add `platform_fee` column to the DB and insert it here if you need reporting.
    })
    .select("id")
    .single();

  if (error) return { data: null, invoiceUrl: null, error: error.message };

  // We must use admin client to bypass RLS since consumers cannot update listings directly
  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. Reduce stock temporarily (kalau invoice expired nanti harus dikembalikan)
  await adminSupabase.rpc('increment_sold', { x_listing_id: listingId, x_qty: quantity });

  // 3. Create Xendit Invoice
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    // Kita hapus proteksi dummy key agar Xendit benar-benar terpanggil
    if (!process.env.XENDIT_SECRET_KEY) {
      return { data: order.id, invoiceUrl: null, qrisString: null, vaNumber: null, gopayUrl: null, error: null };
    }

    const xenditToken = Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64');

    if (method === "qris") {
      try {
        const qrRes = await fetch("https://api.xendit.co/qr_codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${xenditToken}`,
            "api-version": "2022-07-31"
          },
          body: JSON.stringify({
            reference_id: order.id,
            type: "DYNAMIC",
            amount: grandTotal,
            currency: "IDR"
          })
        });

        if (!qrRes.ok) {
          const errData = await qrRes.json();
          console.error("Xendit API Response:", errData);
          throw new Error("Gagal memanggil API Xendit QRIS");
        }

        const qrData = await qrRes.json();
        
        await adminSupabase.from("orders").update({
          payment_link: qrData.qr_string
        }).eq("id", order.id);

        return { data: order.id, invoiceUrl: null, qrisString: qrData.qr_string, vaNumber: null, gopayUrl: null, error: null };
      } catch (qrErr: any) {
        console.error("Xendit QR Error:", qrErr);
        await adminSupabase.from("orders").delete().eq("id", order.id);
        await adminSupabase.rpc('increment_sold', { x_listing_id: listingId, x_qty: -quantity });
        return { data: null, invoiceUrl: null, qrisString: null, vaNumber: null, gopayUrl: null, error: "Gagal membuat QRIS" };
      }
    }

    if (method.startsWith("va_")) {
      const bankCode = method.replace("va_", "").toUpperCase();
      try {
        const resVA = await fetch("https://api.xendit.co/payment_requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${xenditToken}`
          },
          body: JSON.stringify({
            reference_id: order.id,
            amount: grandTotal,
            currency: "IDR",
            payment_method: {
              type: "VIRTUAL_ACCOUNT",
              reusability: "ONE_TIME_USE",
              virtual_account: {
                channel_code: bankCode,
                channel_properties: {
                  customer_name: userData?.name || "Food Rescue User"
                }
              }
            }
          })
        });

        if (!resVA.ok) throw new Error(`Gagal memanggil API Xendit VA ${bankCode}`);
        const dataVA = await resVA.json();
        const vNumber = dataVA.payment_method.virtual_account.channel_properties.virtual_account_number;
        
        await adminSupabase.from("orders").update({
          va_number: vNumber
        }).eq("id", order.id);

        return { 
          data: order.id, 
          invoiceUrl: null, 
          qrisString: null, 
          vaNumber: vNumber, 
          gopayUrl: null, 
          error: null 
        };
      } catch (err) {
        await adminSupabase.from("orders").delete().eq("id", order.id);
        await adminSupabase.rpc('increment_sold', { x_listing_id: listingId, x_qty: -quantity });
        return { data: null, invoiceUrl: null, qrisString: null, vaNumber: null, gopayUrl: null, error: `Gagal membuat VA ${bankCode}` };
      }
    }

    if (method === "gopay" || method === "dana" || method === "shopeepay") {
      try {
        const resEw = await fetch("https://api.xendit.co/payment_requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${xenditToken}`
          },
          body: JSON.stringify({
            reference_id: order.id,
            amount: grandTotal,
            currency: "IDR",
            payment_method: {
              type: "EWALLET",
              reusability: "ONE_TIME_USE",
              ewallet: {
                channel_code: method.toUpperCase(),
                channel_properties: {
                  success_return_url: `${siteUrl}/orders/${order.id}?success=true`,
                  failure_return_url: `${siteUrl}/checkout?id=${listingId}&error=ewallet_failed`,
                  cancel_return_url: `${siteUrl}/checkout?id=${listingId}&error=ewallet_cancelled`
                }
              }
            }
          })
        });

        if (!resEw.ok) throw new Error(`Gagal memanggil API Xendit ${method}`);
        const dataEw = await resEw.json();
        const actionUrl = dataEw.actions?.find((a: any) => a.action === "AUTH")?.url;
        
        await adminSupabase.from("orders").update({
          payment_link: actionUrl
        }).eq("id", order.id);

        return { data: order.id, invoiceUrl: null, qrisString: null, vaNumber: null, gopayUrl: actionUrl, error: null };
      } catch (err) {
        await adminSupabase.from("orders").delete().eq("id", order.id);
        await adminSupabase.rpc('increment_sold', { x_listing_id: listingId, x_qty: -quantity });
        return { data: null, invoiceUrl: null, qrisString: null, vaNumber: null, gopayUrl: null, error: `Gagal memproses ${method}` };
      }
    }

    if (method === "ovo") {
      try {
        let phone = ovoPhone || "";
        if (phone.startsWith("0")) phone = "+62" + phone.slice(1);
        if (!phone.startsWith("+62")) phone = "+62" + phone;

        const resEw = await fetch("https://api.xendit.co/payment_requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${xenditToken}`
          },
          body: JSON.stringify({
            reference_id: order.id,
            amount: grandTotal,
            currency: "IDR",
            payment_method: {
              type: "EWALLET",
              reusability: "ONE_TIME_USE",
              ewallet: {
                channel_code: "OVO",
                channel_properties: {
                  mobile_number: phone
                }
              }
            }
          })
        });

        if (!resEw.ok) throw new Error("Gagal memanggil API Xendit OVO");
        return { data: order.id, invoiceUrl: null, qrisString: null, vaNumber: null, gopayUrl: null, error: null };
      } catch (err) {
        await adminSupabase.from("orders").delete().eq("id", order.id);
        await adminSupabase.rpc('increment_sold', { x_listing_id: listingId, x_qty: -quantity });
        return { data: null, invoiceUrl: null, qrisString: null, vaNumber: null, gopayUrl: null, error: "Gagal memproses OVO. Pastikan nomor HP valid." };
      }
    }

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

    return { data: order.id, invoiceUrl: invoice.invoiceUrl, qrisString: null, error: null };
  } catch (err: any) {
    // Revert if payment creation fails
    console.error("Xendit Invoice Error:", err);
    await adminSupabase.from("orders").delete().eq("id", order.id);
    await adminSupabase.rpc('increment_sold', { x_listing_id: listingId, x_qty: -quantity });
    return { data: null, invoiceUrl: null, qrisString: null, error: "Gagal membuat pembayaran" };
  }
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function simulatePaymentSuccess(orderId: string) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await adminSupabase.from("orders").update({ status: "paid" }).eq("id", orderId);
    
    // Notify Merchant
    const { data: order } = await adminSupabase.from("orders").select("quantity, listings(merchant_id, title)").eq("id", orderId).single();
    if (order && order.listings) {
      const { data: merchant } = await adminSupabase.from("merchants").select("user_id").eq("id", (order.listings as any).merchant_id).single();
      if (merchant) {
        await createNotification(merchant.user_id, `Pesanan baru masuk: ${(order.listings as any).title} (${order.quantity} porsi). Segera siapkan!`, "order_new", "Order Baru");
      }
    }

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
  }
}

export async function verifyOrderByQr(qrCode: string) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { error: "Development mode" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Cari order berdasarkan QR Code
  const { data: order, error: searchError } = await supabase
    .from("orders")
    .select("id, status, listings(merchant_id)")
    .eq("qr_code", qrCode)
    .single();

  if (searchError || !order) return { error: "QR Code tidak valid atau tidak ditemukan" };

  const { data: merchant } = await supabase.from("merchants").select("id").eq("user_id", user.id).single();
  if (!merchant || (order.listings as any).merchant_id !== merchant.id) {
    return { error: "Order ini bukan dari toko Anda." };
  }

  if (order.status !== "paid") return { error: `Order tidak valid (Status: ${order.status})` };

  return verifyOrder(order.id);
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
    .select("id, total_weight_kg, user_id, listings(title)")
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

  // Notify Consumer
  await createNotification(
    order.user_id, 
    `Terima kasih telah menyelamatkan makanan dari ${(order.listings as any).title}! Jangan lupa berikan ulasan.`,
    "order_completed",
    "Pesanan Selesai"
  );

  revalidatePath("/merchant/orders");
  revalidatePath("/merchant/analytics");
  return { error: null };
}

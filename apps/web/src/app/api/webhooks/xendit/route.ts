import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Initialize a service role client to bypass RLS for webhook updates
function getServiceSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Harus pakai service role key, bukan anon key
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function POST(req: Request) {
  try {
    const xenditToken = req.headers.get("x-callback-token");
    if (xenditToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: "Invalid webhook token" }, { status: 403 });
    }

    const body = await req.json();
    
    // Xendit QRIS Webhook sends 'reference_id' instead of 'external_id' 
    // and status is implicitly paid if the webhook triggers for QR code payment
    const external_id = body.external_id || body.data?.reference_id || body.reference_id;
    const status = body.status || body.data?.status || "PAID"; // QR callback usually means it's paid
    const amount = body.amount || body.data?.amount;

    if (!external_id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    if (status === "PAID" || status === "SETTLED" || status === "COMPLETED") {
      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", external_id);

      // Insert ke payments table (opsional, karena order sudah ada total_price)
      await supabase
        .from("payments")
        .insert({
          order_id: external_id,
          amount: amount || 0,
          method: body.payment_method || body.event || "xendit",
          status: "success",
          midtrans_ref: body.id || body.qr_id // we repurpose this column for xendit invoice id
        });
        
    } else if (status === "EXPIRED" || status === "FAILED") {
      await supabase
        .from("orders")
        .update({ status: "expired" })
        .eq("id", external_id);
        
      // Return stock
      const { data: order } = await supabase.from("orders").select("listing_id, quantity").eq("id", external_id).single();
      if (order) {
        await supabase.rpc('increment_sold', { x_listing_id: order.listing_id, x_qty: -order.quantity });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

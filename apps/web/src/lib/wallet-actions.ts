"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function requestWithdrawal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: merchant } = await supabase.from("merchants").select("id, bank_name, bank_account_number, bank_account_name").eq("user_id", user.id).single();
  if (!merchant) return { error: "Merchant not found" };

  if (!merchant.bank_name || !merchant.bank_account_number || !merchant.bank_account_name) {
    return { error: "Lengkapi data rekening bank di Profil terlebih dahulu." };
  }

  const amount = parseInt(formData.get("amount") as string);
  
  if (isNaN(amount) || amount < 10000) {
    return { error: "Minimal penarikan adalah Rp 10.000" };
  }

  // Validate balance
  const { data: orders } = await supabase.from("orders").select("total_price").eq("status", "picked_up").eq("listing_id", merchant.id);
  // Wait, listings table holds merchant_id.
  const { data: realOrders } = await supabase
    .from("orders")
    .select(`total_price, listings!inner(merchant_id)`)
    .eq("listings.merchant_id", merchant.id)
    .eq("status", "picked_up");

  const total_revenue = (realOrders || []).reduce((acc, row) => acc + Number(row.total_price), 0);

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("amount")
    .eq("merchant_id", merchant.id)
    .neq("status", "rejected");

  const total_withdrawn = (withdrawals || []).reduce((acc, row) => acc + Number(row.amount), 0);

  const current_balance = total_revenue - total_withdrawn;

  if (amount > current_balance) {
    return { error: `Saldo tidak mencukupi. Saldo Anda: Rp ${current_balance.toLocaleString("id-ID")}` };
  }

  const { error } = await supabase.from("withdrawals").insert({
    merchant_id: merchant.id,
    amount,
    bank_name: merchant.bank_name,
    account_number: merchant.bank_account_number,
    account_name: merchant.bank_account_name
  });

  if (error) return { error: error.message };

  revalidatePath("/merchant/wallet");
  return { success: true };
}
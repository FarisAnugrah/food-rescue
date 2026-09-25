"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function processWithdrawal(id: string, status: "completed" | "rejected") {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  await adminSupabase
    .from("withdrawals")
    .update({ status, processed_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/wallet");
}
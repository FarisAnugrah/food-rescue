"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification-actions";

export async function approveMerchant(merchantId: string, userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  await adminSupabase.from("merchants").update({ verified: true }).eq("id", merchantId);
  
  await createNotification(userId, "Selamat! Toko Anda telah diverifikasi. Anda sekarang dapat mulai memposting makanan surplus.", "verification_success");

  revalidatePath("/admin");
  revalidatePath("/admin/merchants");
}

export async function rejectMerchant(merchantId: string, userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // We could delete them or just leave them unverified with a note. Deleting is easiest for rejection.
  await adminSupabase.from("merchants").delete().eq("id", merchantId);
  
  await createNotification(userId, "Maaf, pengajuan toko Anda ditolak. Pastikan data yang dimasukkan valid.", "verification_failed");

  revalidatePath("/admin");
  revalidatePath("/admin/merchants");
}
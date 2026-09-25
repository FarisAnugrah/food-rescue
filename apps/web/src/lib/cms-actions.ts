"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updateLandingAsset(key: string, url: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  await adminSupabase
    .from("landing_assets")
    .upsert({ key, url, updated_at: new Date().toISOString() });

  revalidatePath("/");
  revalidatePath("/admin/cms");
}

export async function updateTestimonial(id: string, quote: string, name: string, role: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (id === "new") {
    await adminSupabase
      .from("testimonials")
      .insert({ quote, name, role, is_active: true });
  } else {
    await adminSupabase
      .from("testimonials")
      .update({ quote, name, role })
      .eq("id", id);
  }

  revalidatePath("/");
  revalidatePath("/admin/cms");
}

export async function toggleTestimonialStatus(id: string, is_active: boolean) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  await adminSupabase
    .from("testimonials")
    .update({ is_active })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/cms");
}
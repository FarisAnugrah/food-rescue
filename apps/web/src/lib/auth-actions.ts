"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || "consumer";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Jika merchant, kita buat row dummy di merchants table
  // Supaya dia bisa langsung buka dashboard /merchant tanpa error "Profile not found"
  if (role === "merchant") {
    // Kita tunggu sebentar agar trigger auth auth.users selesai bikin record users
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Auth user id bisa didapat dengan select pakai email (atau biarkan insert default jalan dulu)
    const { data: userRecord } = await supabase.from("users").select("id").eq("email", email).single();
    
    if (userRecord) {
      await supabase.from("merchants").insert({
        user_id: userRecord.id,
        store_name: name, // Default ke nama pendaftar
        description: "",
        address: "Belum diset",
        phone: "-",
        verified: false,
      });
    }
  }

  redirect("/dashboard");
}

export async function loginWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

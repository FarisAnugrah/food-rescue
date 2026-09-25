"use server";

import { createClient } from "./supabase/server";

export async function getLandingPageData() {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { stats: null, testimonials: [] };

  // Get real-time stats
  const { count: totalMerchants } = await supabase.from("merchants").select("*", { count: "exact", head: true }).eq("verified", true);
  
  const { data: impactData } = await supabase.from("impact_logs").select("food_kg");
  const total_kg_saved = (impactData || []).reduce((acc, row) => acc + Number(row.food_kg), 0);

  // Get testimonials
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, quote, name, role")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Default hardcoded ones if DB is empty or fails
  const defaultTestimonials = [
    {
      id: "t1",
      quote: "Awalnya skeptis, tapi ternyata makanannya masih layak banget. Sekarang tiap sore saya cek app-nya sebelum pulang kerja.",
      name: "Rendra A.",
      role: "Consumer, Jakarta Selatan",
    },
    {
      id: "t2",
      quote: "Dulu makanan sisa tiap malam dibuang. Sekarang malah jadi revenue tambahan. Tim onboarding-nya juga helpful banget.",
      name: "Dewi S.",
      role: "Owner Bakery, Bandung",
    },
  ];

  return {
    stats: {
      merchants: totalMerchants || 0,
      kg_saved: total_kg_saved || 0
    },
    testimonials: (testimonials && testimonials.length > 0) ? testimonials : defaultTestimonials
  };
}
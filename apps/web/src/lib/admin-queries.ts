"use server";

import { createClient } from "./supabase/server";

export async function getAdminDashboardStats() {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { data: null };

  const { count: totalMerchants } = await supabase.from("merchants").select("*", { count: "exact", head: true });
  const { count: totalConsumers } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "consumer");
  
  const { data: impactData } = await supabase.from("impact_logs").select("food_kg, co2_kg");
  const total_kg_saved = (impactData || []).reduce((acc, row) => acc + Number(row.food_kg), 0);
  const total_co2_prevented = (impactData || []).reduce((acc, row) => acc + Number(row.co2_kg), 0);

  const { data: orders } = await supabase.from("orders").select("total_price").eq("status", "picked_up");
  const total_revenue = (orders || []).reduce((acc, row) => acc + Number(row.total_price), 0);
  const total_orders = orders?.length || 0;

  const { count: pending_merchants } = await supabase.from("merchants").select("*", { count: "exact", head: true }).eq("verified", false);

  return {
    data: {
      total_merchants: totalMerchants || 0,
      total_consumers: totalConsumers || 0,
      total_kg_saved,
      total_co2_prevented,
      total_orders,
      total_revenue,
      pending_merchants: pending_merchants || 0,
      flagged_listings: 0 // placeholder
    }
  };
}

export async function getAdminImpactDashboard() {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { data: null };

  const { data: impactData } = await supabase.from("impact_logs").select("food_kg, co2_kg, created_at");
  const total_kg_saved = (impactData || []).reduce((acc, row) => acc + Number(row.food_kg), 0);
  const total_co2_prevented = (impactData || []).reduce((acc, row) => acc + Number(row.co2_kg), 0);

  const { data: orders } = await supabase.from("orders").select("total_price").eq("status", "picked_up");
  const total_revenue = (orders || []).reduce((acc, row) => acc + Number(row.total_price), 0);
  const total_orders = orders?.length || 0;

  // Chart data (Monthly)
  const monthlyMap: Record<string, number> = {};
  (impactData || []).forEach(log => {
    const d = new Date(log.created_at);
    const m = d.toLocaleDateString("id-ID", { month: "short" });
    monthlyMap[m] = (monthlyMap[m] || 0) + Number(log.food_kg);
  });
  
  const chart = Object.entries(monthlyMap).map(([month, kg]) => ({ month, kg }));

  // Top Merchants
  const { data: topMerchantsData } = await supabase
    .from("merchants")
    .select("store_name, total_kg_saved")
    .order("total_kg_saved", { ascending: false })
    .limit(5);

  const topMerchants = (topMerchantsData || []).map(m => ({
    name: m.store_name,
    kg: m.total_kg_saved || 0
  }));

  return {
    data: {
      stats: { total_kg_saved, total_co2_prevented, total_orders, total_revenue },
      chart: chart.length > 0 ? chart : [{ month: "-", kg: 0 }],
      topMerchants
    }
  };
}

export async function getPendingMerchants() {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { data: [] };

  const { data } = await supabase
    .from("merchants")
    .select(`
      id,
      user_id,
      store_name,
      owner_name,
      ktp_url,
      address,
      created_at,
      users ( name, email )
    `)
    .eq("verified", false)
    .order("created_at", { ascending: true });

  return { data: data || [] };
}

export async function getVerifiedMerchants() {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { data: [] };

  const { data } = await supabase
    .from("merchants")
    .select(`
      id,
      store_name,
      address,
      rating,
      total_kg_saved
    `)
    .eq("verified", true)
    .order("created_at", { ascending: false });

  return { data: data || [] };
}
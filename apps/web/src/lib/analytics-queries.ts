"use server";

import { createClient } from "./supabase/server";

export async function getMerchantAnalytics(filter: "week" | "month" | "all" = "all") {
  const supabase = await createClient();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { DUMMY_MERCHANT_STATS } = await import("./dummy-merchant");
    const WEEKLY = [
      { day: "Sen", kg: 12.5 }, { day: "Sel", kg: 18.2 }, { day: "Rab", kg: 15.0 },
      { day: "Kam", kg: 22.3 }, { day: "Jum", kg: 28.1 }, { day: "Sab", kg: 19.4 }, { day: "Min", kg: 12.0 },
    ];
    const DUMMY_REVIEWS = [
      { id: "r1", rating: 5, comment: "Mantap makanannya masih hangat!", created_at: new Date().toISOString(), user_name: "Budi S." },
      { id: "r2", rating: 4, comment: "Enak, lumayan buat makan malam", created_at: new Date(Date.now() - 86400000).toISOString(), user_name: "Siti A." },
    ];
    return { data: { stats: DUMMY_MERCHANT_STATS, chart: WEEKLY, reviews: DUMMY_REVIEWS }, error: null };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const { data: merchant } = await supabase.from("merchants").select("*").eq("user_id", user.id).single();
  if (!merchant) return { data: null, error: "Merchant not found" };

  // Determine date boundary
  let dateFilter = new Date(0); // Default 'all'
  const today = new Date();
  
  if (filter === "week") {
    dateFilter = new Date(today);
    dateFilter.setDate(dateFilter.getDate() - 7);
  } else if (filter === "month") {
    dateFilter = new Date(today);
    dateFilter.setMonth(dateFilter.getMonth() - 1);
  }

  // Fetch picked up orders for revenue & chart
  const { data: orders } = await supabase
    .from("orders")
    .select(`total_price, total_weight_kg, picked_up_at, listings!inner(merchant_id)`)
    .eq("listings.merchant_id", merchant.id)
    .eq("status", "picked_up")
    .gte("picked_up_at", dateFilter.toISOString());

  // Aggregate stats
  let total_kg_saved = merchant.total_kg_saved; // Base total
  let total_co2_prevented = total_kg_saved * 2.5;
  let total_revenue = 0;
  let total_orders = 0;

  // Chart data preparation
  const chartDataMap: Record<string, number> = {};

  if (orders && orders.length > 0) {
    total_orders = orders.length;
    
    orders.forEach((o: any) => {
      total_revenue += o.total_price;
      
      // Chart aggregation
      if (o.picked_up_at) {
        const dateObj = new Date(o.picked_up_at);
        let key = "";
        
        if (filter === "week") {
          // Label by Day Name (Sen, Sel, Rab, etc)
          const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
          key = days[dateObj.getDay()];
        } else {
          // Label by Date (1 Sep, 2 Sep, etc)
          key = `${dateObj.getDate()} ${dateObj.toLocaleString('id-ID', { month: 'short' })}`;
        }
        
        chartDataMap[key] = (chartDataMap[key] || 0) + parseFloat(o.total_weight_kg);
      }
    });
  }

  // Format chart data array
  let chartArray = Object.keys(chartDataMap).map(k => ({ label: k, kg: chartDataMap[k] }));
  
  // If empty, provide placeholder
  if (chartArray.length === 0) {
    chartArray = [{ label: "-", kg: 0 }];
  }

  const stats = {
    total_kg_saved,
    total_co2_prevented,
    total_revenue,
    total_orders,
    rating: merchant.rating,
  };

  // Fetch recent reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`id, rating, comment, created_at, users ( name )`)
    .eq("merchant_id", merchant.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const formattedReviews = (reviews || []).map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    user_name: r.users?.name || "Anonim"
  }));

  return { data: { stats, chart: chartArray, reviews: formattedReviews }, error: null };
}

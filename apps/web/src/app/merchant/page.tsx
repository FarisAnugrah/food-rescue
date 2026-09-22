import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatWeight } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { createClient } from "@/lib/supabase/server";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MerchantDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Auto-Repair: Pastikan dia punya record "merchants" & role-nya "merchant"
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Cek Role di tabel users
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile && profile.role !== "merchant") {
      await supabase.from("users").update({ role: "merchant" }).eq("id", user.id);
    }

    // Cek record di tabel merchants
    const { data: merchantStore } = await supabase.from("merchants").select("id").eq("user_id", user.id).single();
    if (!merchantStore) {
      await supabase.from("merchants").insert({
        user_id: user.id,
        store_name: user.user_metadata?.name || "Toko Baru",
        description: "",
        address: "Belum diset",
        phone: "-",
      });
    }
  }

  let stats = {
    total_kg_saved: 0,
    total_co2_prevented: 0,
    total_revenue: 0,
    total_orders: 0,
    rating: 0,
    active_listings: 0,
  };
  let recentOrders: any[] = [];
  let activeListings: any[] = [];
  let storeName = user.user_metadata?.name || "Toko Baru";

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data: merchantData } = await supabase.from("merchants").select("*").eq("user_id", user.id).single();
    if (merchantData) {
      storeName = merchantData.store_name;
      stats = {
        total_kg_saved: merchantData.total_kg_saved || 0,
        total_co2_prevented: (merchantData.total_kg_saved || 0) * 2.5,
        total_revenue: 0, // Placeholder for MVP
        total_orders: 0, // Placeholder for MVP
        rating: merchantData.rating || 0,
        active_listings: 0,
      };

      // Fetch Real Active Listings
      const { data: realListings } = await supabase.from("listings").select("*").eq("merchant_id", merchantData.id).eq("status", "active").order("created_at", { ascending: false }).limit(3);
      if (realListings) activeListings = realListings as any;

      // Fetch Real Orders (Limit to 4 latest)
      const { data: realOrders } = await supabase
        .from("orders")
        .select(`*, users(name), listings!inner(title, merchant_id)`)
        .eq("listings.merchant_id", merchantData.id)
        .eq("status", "paid")
        .order("created_at", { ascending: false })
        .limit(4);

      if (realOrders) {
        recentOrders = realOrders.map((o: any) => ({
          ...o,
          listing_title: o.listings?.title,
          consumer_name: o.users?.name,
        })) as any;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantNav active="/merchant" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Selamat datang kembali, <span className="font-semibold text-gray-700">{storeName}</span></p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
          {[
            { label: "Makanan Diselamatkan", value: formatWeight(stats.total_kg_saved), color: "text-[#2d6a4f]" },
            { label: "CO₂ Dicegah", value: formatWeight(stats.total_co2_prevented), color: "text-[#52b788]" },
            { label: "Revenue Tambahan", value: formatCurrency(stats.total_revenue), color: "text-gray-900" },
            { label: "Rating", value: <div className="flex items-center gap-1.5">{stats.rating} <Star className="w-4 h-4 fill-orange-400 text-orange-400" /></div>, color: "text-gray-900" },
          ].map((s, idx) => (
            <div key={idx} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 flex flex-col justify-between">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
              <div className={`mt-3 text-2xl font-black tracking-tight ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-bold text-gray-900">Order Masuk</h2>
              <Link href="/merchant/orders" className="text-sm text-[#2d6a4f] font-semibold hover:underline">Lihat semua</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                 <p className="text-sm font-medium text-gray-500">Belum ada order masuk hari ini.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentOrders.map((o) => (
                  <div key={o.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 flex items-center justify-between hover:ring-black/10 transition-all">
                    <div>
                      <p className="font-bold text-gray-900 text-base">{o.listing_title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{o.consumer_name} · <span className="font-medium text-gray-700">{o.quantity} porsi</span></p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="font-black text-gray-900 text-base">{formatCurrency(o.total_price)}</p>
                      <span className="mt-1 rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        Siap Pickup
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-bold text-gray-900">Listing Aktif</h2>
              <Link href="/merchant/listings" className="text-sm text-[#2d6a4f] font-semibold hover:underline">Kelola menu</Link>
            </div>
            <div className="flex flex-col gap-3">
              {activeListings.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                   <p className="text-sm font-medium text-gray-500">Tidak ada makanan yang dijual saat ini.</p>
                 </div>
              ) : activeListings.map((l) => (
                <div key={l.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 flex items-center justify-between hover:ring-black/10 transition-all">
                  <div>
                    <p className="font-bold text-gray-900 text-base">{l.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-[#52b788] bg-[#e8f5e9] px-2 py-0.5 rounded">
                        Sisa {l.quantity - l.quantity_sold}
                      </span>
                      <span className="text-xs text-gray-400">dari {l.quantity}</span>
                    </div>
                  </div>
                  <p className="font-black text-[#2d6a4f] text-lg">{formatCurrency(l.discounted_price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

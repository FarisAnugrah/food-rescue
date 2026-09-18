import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatWeight } from "@food-rescue/shared";
import MerchantNav from "@/components/merchant/merchant-nav";
import { createClient } from "@/lib/supabase/server";
import { DUMMY_MERCHANT_STATS, DUMMY_MERCHANT_ORDERS } from "@/lib/dummy-merchant";
import { DUMMY_LISTINGS } from "@/lib/dummy-data";

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

  // --- Fetch data Merchant asli ---
  let stats = DUMMY_MERCHANT_STATS;
  let recentOrders = DUMMY_MERCHANT_ORDERS.filter((o) => o.status === "paid");
  let activeListings = DUMMY_LISTINGS.filter((l) => l.status === "active").slice(0, 3);
  let storeName = "Toko Baru";

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data: merchantData } = await supabase.from("merchants").select("*").eq("user_id", user.id).single();
    if (merchantData) {
      storeName = merchantData.store_name;
      stats = {
        total_kg_saved: merchantData.total_kg_saved,
        total_co2_prevented: merchantData.total_kg_saved * 2.5,
        total_revenue: 0, // Placeholder
        total_orders: 0, // Placeholder
        rating: merchantData.rating,
        active_listings: 0,
      };

      // Fetch Real Active Listings
      const { data: realListings } = await supabase.from("listings").select("*").eq("merchant_id", merchantData.id).eq("status", "active").order("created_at", { ascending: false }).limit(3);
      if (realListings) activeListings = realListings as any;

      // Fetch Real Orders
      const { data: realOrders } = await supabase
        .from("orders")
        .select(`*, users(name), listings!inner(title, merchant_id)`)
        .eq("listings.merchant_id", merchantData.id)
        .eq("status", "paid")
        .order("created_at", { ascending: false });

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
    <div className="min-h-screen bg-[#fafaf7]">
      <MerchantNav active="/merchant" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332]">Dashboard</h1>
        <p className="mt-1 text-[#888]">Selamat datang kembali, {storeName}</p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Makanan Diselamatkan", value: formatWeight(stats.total_kg_saved), color: "#2d6a4f" },
            { label: "CO₂ Dicegah", value: formatWeight(stats.total_co2_prevented), color: "#52b788" },
            { label: "Revenue Tambahan", value: formatCurrency(stats.total_revenue), color: "#1b4332" },
            { label: "Rating", value: `${stats.rating} ⭐`, color: "#2d6a4f" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white border border-[#e8e4d4] p-5">
              <p className="text-xs text-[#888]">{s.label}</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1b4332]">Order Masuk</h2>
              <Link href="/merchant/orders" className="text-sm text-[#2d6a4f] font-medium hover:underline">Lihat semua</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-[#aaa]">Belum ada order masuk.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentOrders.map((o) => (
                  <div key={o.id} className="rounded-xl bg-white border border-[#e8e4d4] p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1b4332] text-sm">{o.listing_title}</p>
                      <p className="text-xs text-[#888]">{o.consumer_name} · {o.quantity} bag</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1b4332] text-sm">{formatCurrency(o.total_price)}</p>
                      <span className="rounded-full bg-[#fefae0] px-2 py-0.5 text-xs font-semibold text-[#1b4332]">
                        Menunggu pickup
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1b4332]">Listing Aktif</h2>
              <Link href="/merchant/listings" className="text-sm text-[#2d6a4f] font-medium hover:underline">Kelola</Link>
            </div>
            <div className="flex flex-col gap-3">
              {activeListings.length === 0 ? (
                 <p className="text-sm text-[#aaa]">Tidak ada listing aktif.</p>
              ) : activeListings.map((l) => (
                <div key={l.id} className="rounded-xl bg-white border border-[#e8e4d4] p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1b4332] text-sm">{l.title}</p>
                    <p className="text-xs text-[#888]">Sisa {l.quantity - l.quantity_sold} / {l.quantity} bag</p>
                  </div>
                  <p className="font-bold text-[#2d6a4f] text-sm">{formatCurrency(l.discounted_price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth-actions";
import ListingCard from "@/components/listing-card";
import NotificationBell from "@/components/notification-bell";
import type { Listing } from "@food-rescue/shared";
import { createClient } from "@supabase/supabase-js";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map-view"), { ssr: false, loading: () => <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-2xl border border-[#e8e4d4]" /> });

const CATEGORIES = ["Semua", "Bakery", "Restoran", "Japanese", "Western", "Healthy"];

export default function ListingsClient({ initialListings, user }: { initialListings: (Listing & { merchant_name: string; merchant_address: string })[], user?: any }) {
  const [listings, setListings] = useState(initialListings);
  const [category, setCategory] = useState("Semua");
  const [halalOnly, setHalalOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Setup Realtime Subscription
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const channel = supabase
      .channel("listings_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "listings" },
        (payload) => {
          setListings((prev) => 
            prev.map((l) => l.id === payload.new.id ? { ...l, ...payload.new } : l)
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "listings" },
        (payload) => {
          // Hanya tambahkan jika listing statusnya active
          if (payload.new.status === "active") {
            // Karena relasi merchant belum terisi, kita cuma punya merchant_id.
            // Idealnya fetching ulang, tapi buat realtime cukup kita push dengan data seadanya dulu
            setListings((prev) => [payload.new as any, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const userInitial = user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (category !== "Semua" && l.category !== category) return false;
      if (halalOnly && !l.is_halal) return false;
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.merchant_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [listings, category, halalOnly, search]);

  const active = filtered.filter((l) => l.status === "active");
  const soldOut = filtered.filter((l) => l.status === "sold_out");

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#1b4332]">
            food<span className="text-[#2d6a4f]">rescue</span>
          </Link>
          <div className="flex gap-2 items-center">
            <Link href="/orders" className="rounded-full px-4 py-2 text-sm font-medium text-[#1b4332] hover:bg-[#d8f3dc] transition-colors">
              My Orders
            </Link>
            <NotificationBell />
            <div className="h-4 w-px bg-[#e8e4d4] mx-1" />
            <Link href="/profile" title="Profil Saya">
              <div className="w-8 h-8 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-sm font-bold shadow-sm hover:scale-105 transition-transform cursor-pointer">
                {userInitial}
              </div>
            </Link>
            <form action={logout}>
              <button type="submit" className="text-xs text-[#888] hover:text-[#e63946] ml-2 transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1b4332]">Rescue Makanan</h1>
          <p className="mt-1 text-[#888]">Temukan surprise bag & makanan diskon di sekitarmu</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap gap-2 hide-scrollbar">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === c
                    ? "bg-[#2d6a4f] text-white"
                    : "bg-white border border-[#e8e4d4] text-[#555] hover:border-[#2d6a4f]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Cari makanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border border-[#e8e4d4] bg-white px-4 py-2.5 text-sm focus:border-[#2d6a4f] focus:outline-none flex-1 min-w-[200px]"
            />
            <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-[#555] cursor-pointer bg-white border border-[#e8e4d4] px-4 py-2.5 rounded-full hover:border-[#2d6a4f] transition-colors">
              <input
                type="checkbox"
                checked={halalOnly}
                onChange={(e) => setHalalOnly(e.target.checked)}
                className="accent-[#2d6a4f]"
              />
              Halal
            </label>
            <div className="flex shrink-0 bg-white border border-[#e8e4d4] rounded-full p-1">
              <button 
                onClick={() => setViewMode("list")}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${viewMode === "list" ? "bg-[#e8f5e9] text-[#2d6a4f]" : "text-[#888] hover:text-[#2d6a4f]"}`}
              >
                List
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${viewMode === "map" ? "bg-[#e8f5e9] text-[#2d6a4f]" : "text-[#888] hover:text-[#2d6a4f]"}`}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="mb-10 relative z-0">
            <MapView listings={active} />
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="flex overflow-x-auto pb-6 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 hide-scrollbar">
                {active.map((l) => (
                  <ListingCard key={l.id} listing={l} compact={true} />
                ))}
              </div>
            )}

            {soldOut.length > 0 && (
              <>
                <h2 className="mt-12 mb-4 text-lg font-bold text-gray-400">Habis Terjual</h2>
                <div className="flex overflow-x-auto pb-6 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 hide-scrollbar">
                  {soldOut.map((l) => (
                    <ListingCard key={l.id} listing={l} compact={true} />
                  ))}
                </div>
              </>
            )}

            {filtered.length === 0 && (
              <div className="py-20 text-center text-[#aaa]">
                <p className="text-lg">Tidak ada listing ditemukan.</p>
                <p className="mt-1 text-sm">Coba ubah filter atau kata kunci pencarian.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

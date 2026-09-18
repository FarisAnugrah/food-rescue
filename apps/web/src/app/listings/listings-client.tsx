"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth-actions";
import ListingCard from "@/components/listing-card";
import NotificationBell from "@/components/notification-bell";
import type { Listing } from "@food-rescue/shared";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map-view"), { ssr: false, loading: () => <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-2xl border border-[#e8e4d4]" /> });

const CATEGORIES = ["Semua", "Bakery", "Restoran", "Japanese", "Western", "Healthy"];

export default function ListingsClient({ initialListings, user }: { initialListings: (Listing & { merchant_name: string; merchant_address: string })[], user?: any }) {
  const [category, setCategory] = useState("Semua");
  const [halalOnly, setHalalOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const userInitial = user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  const filtered = useMemo(() => {
    return initialListings.filter((l) => {
      if (category !== "Semua" && l.category !== category) return false;
      if (halalOnly && !l.is_halal) return false;
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.merchant_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [initialListings, category, halalOnly, search]);

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
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === c
                    ? "bg-[#2d6a4f] text-white"
                    : "bg-white border border-[#e8e4d4] text-[#555] hover:border-[#2d6a4f]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-[#555] cursor-pointer bg-white border border-[#e8e4d4] px-4 py-2 rounded-full hover:border-[#2d6a4f] transition-colors">
              <input
                type="checkbox"
                checked={halalOnly}
                onChange={(e) => setHalalOnly(e.target.checked)}
                className="accent-[#2d6a4f]"
              />
              Halal
            </label>
            <div className="flex bg-white border border-[#e8e4d4] rounded-full p-1">
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
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border border-[#e8e4d4] bg-white px-4 py-2 text-sm focus:border-[#2d6a4f] focus:outline-none w-44"
            />
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="mb-10 relative z-0">
            <MapView listings={active} />
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}

            {soldOut.length > 0 && (
              <>
                <h2 className="mt-12 mb-4 text-lg font-semibold text-[#aaa]">Sold Out</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {soldOut.map((l) => (
                    <ListingCard key={l.id} listing={l} />
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

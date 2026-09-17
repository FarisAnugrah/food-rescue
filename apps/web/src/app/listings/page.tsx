"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ListingCard from "@/components/listing-card";
import { DUMMY_LISTINGS } from "@/lib/dummy-data";

const CATEGORIES = ["Semua", "Bakery", "Restoran", "Japanese", "Western", "Healthy"];

export default function ListingsPage() {
  const [category, setCategory] = useState("Semua");
  const [halalOnly, setHalalOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return DUMMY_LISTINGS.filter((l) => {
      if (category !== "Semua" && l.category !== category) return false;
      if (halalOnly && !l.is_halal) return false;
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.merchant_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, halalOnly, search]);

  const active = filtered.filter((l) => l.status === "active");
  const soldOut = filtered.filter((l) => l.status === "sold_out");

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#1b4332]">
            food<span className="text-[#2d6a4f]">rescue</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/dashboard" className="rounded-full px-4 py-2 text-sm font-medium text-[#1b4332] hover:bg-[#d8f3dc] transition-colors">
              Dashboard
            </Link>
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

          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
              <input
                type="checkbox"
                checked={halalOnly}
                onChange={(e) => setHalalOnly(e.target.checked)}
                className="accent-[#2d6a4f]"
              />
              Halal only
            </label>
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border border-[#e8e4d4] bg-white px-4 py-2 text-sm focus:border-[#2d6a4f] focus:outline-none w-44"
            />
          </div>
        </div>

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
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MerchantNav from "@/components/merchant/merchant-nav";
import { createListing } from "@/lib/listing-actions";

const CATEGORIES = ["Bakery", "Restoran", "Japanese", "Western", "Healthy", "Lainnya"];

export default function NewListingPage() {
  const router = useRouter();
  const [type, setType] = useState<"surprise_bag" | "specific">("surprise_bag");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("type", type);

    const res = await createListing(formData);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/merchant/listings");
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <MerchantNav active="/merchant/listings" />

      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332]">Listing Baru</h1>
        <p className="mt-1 text-[#888] mb-8">Posting surplus makananmu</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#1b4332]">Foto Makanan / Box</label>
            <input name="photo" type="file" accept="image/*" className="w-full rounded-xl border border-[#e8e4d4] px-4 py-3 bg-white text-sm" />
          </div>

          <div className="flex gap-3">
            {(["surprise_bag", "specific"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                  type === t
                    ? "border-[#2d6a4f] bg-[#d8f3dc] text-[#1b4332]"
                    : "border-[#e8e4d4] bg-white text-[#888] hover:border-[#2d6a4f]"
                }`}
              >
                {t === "surprise_bag" ? "Surprise Bag" : "Item Spesifik"}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Judul</label>
            <input
              name="title"
              required
              placeholder={type === "surprise_bag" ? "Surprise Bag — Roti & Pastry" : "Nasi Campur Komplit"}
              className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Deskripsi</label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Jelaskan isi bag / makanan yang ditawarkan..."
              className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Kategori</label>
              <select
                name="category"
                required
                className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Halal?</label>
              <select
                name="is_halal"
                className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none"
              >
                <option value="true">Ya, Halal</option>
                <option value="false">Non-Halal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Harga Asli (Rp)</label>
              <input name="original_price" type="number" required min={1000} placeholder="75000" className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Harga Diskon (Rp)</label>
              <input name="discounted_price" type="number" required min={1000} placeholder="25000" className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Berat (kg)</label>
              <input name="weight_kg" type="number" required min={0.1} step={0.1} placeholder="1.5" className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Jumlah Bag</label>
              <input name="quantity" type="number" required min={1} placeholder="5" className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Pickup Dari</label>
              <input name="pickup_start" type="time" required className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Pickup Sampai</label>
              <input name="pickup_end" type="time" required className="w-full rounded-xl border border-[#e8e4d4] bg-white px-4 py-3 text-sm focus:border-[#2d6a4f] focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-1.5">Foto</label>
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-[#e8e4d4] bg-white py-10 text-sm text-[#aaa] hover:border-[#2d6a4f] cursor-pointer transition-colors">
              Klik atau drag foto ke sini
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-[#2d6a4f] py-3.5 text-sm font-bold text-white hover:bg-[#1b4332] transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Publish Listing"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => router.back()}
              className="rounded-full border border-[#e8e4d4] px-6 py-3.5 text-sm font-medium text-[#555] hover:bg-[#f0ede0] transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

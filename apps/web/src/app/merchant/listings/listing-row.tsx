"use client";

import { useState } from "react";
import { formatCurrency } from "@food-rescue/shared";
import { updateListingStock } from "@/lib/listing-actions";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-[#d8f3dc] text-[#2d6a4f]",
  sold_out: "bg-[#fefae0] text-[#92400e]",
  expired: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  sold_out: "Habis",
  expired: "Expired",
};

export default function ListingRow({ listing }: { listing: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newQty, setNewQty] = useState(listing.quantity.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = listing.quantity - listing.quantity_sold;
  const startObj = new Date(listing.pickup_start);
  const endObj = new Date(listing.pickup_end);
  const start = startObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const end = endObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const dateStr = startObj.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

  async function handleSave() {
    const parsedQty = parseInt(newQty);
    if (isNaN(parsedQty)) {
      setError("Jumlah tidak valid");
      return;
    }
    
    if (parsedQty < listing.quantity_sold) {
      setError("Stok tidak bisa < yang terjual");
      return;
    }

    setLoading(true);
    setError("");
    const res = await updateListingStock(listing.id, parsedQty);
    
    if (res.error) {
      setError(res.error);
    } else {
      setIsEditing(false);
    }
    setLoading(false);
  }

  return (
    <tr className="border-b border-[#f0ede0] last:border-0 hover:bg-[#fafaf7]">
      <td className="px-5 py-4">
        <p className="font-medium text-[#1b4332]">{listing.title}</p>
        <p className="text-xs text-[#aaa]">{listing.category} · {listing.weight_kg} kg</p>
      </td>
      <td className="px-5 py-4">
        <p className="font-bold text-[#1b4332]">{formatCurrency(listing.discounted_price)}</p>
        <p className="text-xs text-[#bbb] line-through">{formatCurrency(listing.original_price)}</p>
      </td>
      <td className="px-5 py-4">
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={newQty} 
                onChange={(e) => setNewQty(e.target.value)} 
                className="w-16 rounded border border-[#e8e4d4] px-2 py-1 text-sm outline-none focus:border-[#2d6a4f]"
              />
              <span className="text-xs text-[#888]">Total Stok</span>
            </div>
            {error && <span className="text-[10px] text-red-500">{error}</span>}
          </div>
        ) : (
          <p className={`font-medium ${remaining <= 2 ? "text-red-500" : "text-[#1b4332]"}`}>
            {remaining} / {listing.quantity}
          </p>
        )}
      </td>
      <td className="px-5 py-4">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[listing.status] || "bg-gray-100"}`}>
          {STATUS_LABELS[listing.status] || listing.status}
        </span>
      </td>
      <td className="px-5 py-4 text-[#888]">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-[#aaa]">{dateStr}</span>
          <span>{start}–{end}</span>
        </div>
      </td>
      <td className="px-5 py-4">
        {listing.status === "expired" || new Date(listing.pickup_end) < new Date() ? (
          <span className="text-xs text-gray-400">Locked</span>
        ) : isEditing ? (
          <div className="flex items-center gap-2">
            <button disabled={loading} onClick={handleSave} className="text-xs font-bold text-[#2d6a4f] hover:underline disabled:opacity-50">
              Simpan
            </button>
            <button disabled={loading} onClick={() => { setIsEditing(false); setError(""); setNewQty(listing.quantity.toString()); }} className="text-xs text-[#888] hover:underline disabled:opacity-50">
              Batal
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-[#2d6a4f] hover:underline">
            Edit Stok
          </button>
        )}
      </td>
    </tr>
  );
}
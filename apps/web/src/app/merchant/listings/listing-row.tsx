"use client";

import { useState } from "react";
import { formatCurrency } from "@food-rescue/shared";
import { updateListingStock } from "@/lib/listing-actions";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
  sold_out: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20",
  expired: "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20",
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

  const remaining = Math.max(0, listing.quantity - listing.quantity_sold);
  const startObj = new Date(listing.pickup_start);
  const endObj = new Date(listing.pickup_end);
  const start = startObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const end = endObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const dateStr = startObj.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

  const isExpired = listing.status === "expired" || endObj < new Date();
  const displayStatus = isExpired ? "expired" : listing.status;

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
    <tr className="group hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-4">
        <p className="font-bold text-gray-900 leading-tight">{listing.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{listing.category} <span className="mx-1">·</span> {listing.weight_kg} kg</p>
      </td>
      <td className="px-5 py-4">
        <p className="font-black text-gray-900">{formatCurrency(listing.discounted_price)}</p>
        <p className="text-xs text-gray-400 line-through decoration-gray-300 mt-0.5">{formatCurrency(listing.original_price)}</p>
      </td>
      <td className="px-5 py-4">
        {isEditing ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={newQty} 
                onChange={(e) => setNewQty(e.target.value)} 
                className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-black transition-colors"
              />
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Total Stok</span>
            </div>
            {error && <span className="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded w-fit">{error}</span>}
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className={`text-base font-black ${remaining <= 2 && !isExpired ? "text-red-600" : "text-gray-900"}`}>
              {remaining}
            </span>
            <span className="text-xs text-gray-500">/ {listing.quantity}</span>
          </div>
        )}
      </td>
      <td className="px-5 py-4">
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${STATUS_STYLES[displayStatus] || "bg-gray-100"}`}>
          {STATUS_LABELS[displayStatus] || displayStatus}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-col text-sm text-gray-600">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{dateStr}</span>
          <span className="font-medium text-gray-700">{start} <span className="text-gray-400 mx-0.5">-</span> {end}</span>
        </div>
      </td>
      <td className="px-5 py-4">
        {listing.status === "expired" || new Date(listing.pickup_end) < new Date() ? (
          <span className="text-xs font-semibold text-gray-400">Terkunci</span>
        ) : isEditing ? (
          <div className="flex items-center gap-3">
            <button disabled={loading} onClick={handleSave} className="text-xs font-bold text-black hover:text-gray-600 transition-colors disabled:opacity-50">
              Simpan
            </button>
            <button disabled={loading} onClick={() => { setIsEditing(false); setError(""); setNewQty(listing.quantity.toString()); }} className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50">
              Batal
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-[#2d6a4f] hover:text-[#1b4332] transition-colors">
            Edit Stok
          </button>
        )}
      </td>
    </tr>
  );
}
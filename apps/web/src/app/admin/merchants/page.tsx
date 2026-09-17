"use client";

import { useState } from "react";
import AdminNav from "@/components/admin/admin-nav";
import { DUMMY_PENDING_MERCHANTS } from "@/lib/dummy-admin";
import { DUMMY_MERCHANT_STATS } from "@/lib/dummy-merchant";

const VERIFIED_MERCHANTS = [
  { id: "m1", store_name: "Bakery Makmur", owner_name: "Siti Rahayu", address: "Jl. Sudirman No. 12", rating: 4.8, total_kg_saved: 127.5, status: "verified" },
  { id: "m2", store_name: "Warung Bu Sari", owner_name: "Sari Dewi", address: "Jl. Gatot Subroto No. 45", rating: 4.6, total_kg_saved: 89.2, status: "verified" },
  { id: "m3", store_name: "Sushi Tei Express", owner_name: "James Tan", address: "Mall Grand Indonesia", rating: 4.9, total_kg_saved: 203.1, status: "verified" },
];

export default function AdminMerchants() {
  const [tab, setTab] = useState<"pending" | "verified">("pending");

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <AdminNav active="/admin/merchants" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332] mb-2">Merchant Management</h1>
        <p className="text-[#888] mb-8">Verifikasi dan kelola merchant</p>

        <div className="flex gap-2 mb-6">
          {(["pending", "verified"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                tab === t ? "bg-[#2d6a4f] text-white" : "border border-[#e8e4d4] text-[#555] hover:border-[#2d6a4f]"
              }`}
            >
              {t === "pending" ? `Pending (${DUMMY_PENDING_MERCHANTS.length})` : `Verified (${VERIFIED_MERCHANTS.length})`}
            </button>
          ))}
        </div>

        {tab === "pending" ? (
          <div className="flex flex-col gap-4">
            {DUMMY_PENDING_MERCHANTS.map((m) => (
              <div key={m.id} className="rounded-2xl bg-white border border-[#e8e4d4] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[#1b4332] text-lg">{m.store_name}</h3>
                    <p className="text-sm text-[#888]">{m.owner_name} · {m.phone}</p>
                    <p className="text-xs text-[#aaa] mt-1">{m.address}</p>
                  </div>
                  <p className="text-xs text-[#aaa]">
                    {new Date(m.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-[#fefae0] px-4 py-2">
                    <p className="text-xs text-[#888]">Dokumen</p>
                    <p className="text-sm font-medium text-[#1b4332]">{m.docs}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-full bg-[#2d6a4f] px-5 py-2 text-sm font-bold text-white hover:bg-[#1b4332] transition-colors">
                      Approve
                    </button>
                    <button className="rounded-full border border-red-200 px-5 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#e8e4d4] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8e4d4] text-left text-xs text-[#888] uppercase tracking-wider">
                  <th className="px-5 py-4">Toko</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Kg Diselamatkan</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {VERIFIED_MERCHANTS.map((m) => (
                  <tr key={m.id} className="border-b border-[#f0ede0] last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#1b4332]">{m.store_name}</p>
                      <p className="text-xs text-[#888]">{m.address}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#2d6a4f]">⭐ {m.rating}</td>
                    <td className="px-5 py-4 text-[#1b4332]">{m.total_kg_saved} kg</td>
                    <td className="px-5 py-4">
                      <button className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        Suspend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

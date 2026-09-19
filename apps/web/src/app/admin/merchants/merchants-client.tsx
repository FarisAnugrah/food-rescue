"use client";

import { useState } from "react";
import AdminActionButtons from "../admin-action-buttons";

export default function AdminMerchantsClient({ initialPending, initialVerified }: { initialPending: any[], initialVerified: any[] }) {
  const [tab, setTab] = useState<"pending" | "verified">("pending");

  return (
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
            {t === "pending" ? `Pending (${initialPending.length})` : `Verified (${initialVerified.length})`}
          </button>
        ))}
      </div>

      {tab === "pending" ? (
        <div className="flex flex-col gap-4">
          {initialPending.length === 0 && (
            <div className="rounded-2xl border border-[#e8e4d4] bg-white p-12 text-center text-[#888]">
              Tidak ada merchant yang menunggu approval.
            </div>
          )}
          {initialPending.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white border border-[#e8e4d4] p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#1b4332] text-lg">{m.store_name}</h3>
                  <p className="text-sm text-[#888]">Pemilik: {m.owner_name || m.users?.name} · {m.users?.email}</p>
                  <p className="text-xs text-[#aaa] mt-1">{m.address}</p>
                </div>
                <p className="text-xs text-[#aaa]">
                  {new Date(m.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-[#e8e4d4] pt-4">
                {m.ktp_url ? (
                  <a href={m.ktp_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#2d6a4f] hover:underline bg-[#e8f5e9] px-3 py-1.5 rounded-full">
                    Lihat Dokumen KTP
                  </a>
                ) : (
                  <span className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-full font-medium">Belum upload KTP</span>
                )}
                <AdminActionButtons merchantId={m.id} userId={m.user_id} />
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
              {initialVerified.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-[#888]">Belum ada merchant yang diverifikasi.</td>
                </tr>
              )}
              {initialVerified.map((m) => (
                <tr key={m.id} className="border-b border-[#f0ede0] last:border-0 hover:bg-[#fafaf7]">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#1b4332]">{m.store_name}</p>
                    <p className="text-xs text-[#888]">{m.address}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#f59e0b]">★ {m.rating}</td>
                  <td className="px-5 py-4 text-[#1b4332] font-medium">{m.total_kg_saved || 0} kg</td>
                  <td className="px-5 py-4">
                    <button className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
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
  );
}
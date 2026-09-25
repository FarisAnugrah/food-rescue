"use client";

import { useState } from "react";
import AdminActionButtons from "../admin-action-buttons";

export default function AdminMerchantsClient({ initialPending, initialVerified }: { initialPending: any[], initialVerified: any[] }) {
  const [tab, setTab] = useState<"pending" | "verified">("pending");
  const [pageP, setPageP] = useState(1);
  const [pageV, setPageV] = useState(1);
  const perPage = 10;

  const displayedPending = initialPending.slice(0, pageP * perPage);
  const displayedVerified = initialVerified.slice(0, pageV * perPage);

  const hasMoreP = displayedPending.length < initialPending.length;
  const hasMoreV = displayedVerified.length < initialVerified.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl mb-1">Merchant Management</h1>
      <p className="text-sm text-gray-500 mb-8">Verifikasi dan kelola merchant</p>

      <div className="flex gap-2 mb-6 bg-gray-200/50 p-1 w-fit rounded-full">
        {(["pending", "verified"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "pending" ? `Pending (${initialPending.length})` : `Verified (${initialVerified.length})`}
          </button>
        ))}
      </div>

      {tab === "pending" ? (
        <div className="flex flex-col gap-4">
          {initialPending.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center text-gray-500 font-medium">
              Tidak ada merchant yang menunggu approval.
            </div>
          )}
          {displayedPending.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 flex flex-col gap-4 hover:ring-black/10 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{m.store_name}</h3>
                  <p className="text-xs text-gray-500">Pemilik: <span className="font-medium text-gray-700">{m.owner_name || m.users?.name}</span> · {m.users?.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{m.address}</p>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {new Date(m.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
                {m.ktp_url ? (
                  <a href={m.ktp_url} target="_blank" rel="noreferrer" className="text-[11px] font-bold uppercase tracking-wider text-[#2d6a4f] hover:text-[#1b4332] bg-[#e8f5e9] px-4 py-2 rounded-full transition-colors">
                    Cek Foto KTP
                  </a>
                ) : (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-4 py-2 rounded-full">Belum upload KTP</span>
                )}
                <AdminActionButtons merchantId={m.id} userId={m.user_id} />
              </div>
            </div>
          ))}

          {hasMoreP && (
            <div className="mt-2 flex justify-center">
              <button 
                onClick={() => setPageP(p => p + 1)}
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr className="border-b border-gray-200 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Toko</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Kg Diselamatkan</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
              {initialVerified.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-500 font-medium">Belum ada merchant yang diverifikasi.</td>
                </tr>
              )}
              {displayedVerified.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900 leading-tight">{m.store_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{m.address}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md text-xs">
                        ★ {m.rating}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-black text-gray-900">{m.total_kg_saved || 0}</span>
                      <span className="text-xs text-gray-500 ml-1">kg</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors">
                        Suspend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {tab === "verified" && hasMoreV && (
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => setPageV(p => p + 1)}
            className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
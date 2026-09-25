"use client";

import { useState } from "react";
import { formatCurrency } from "@food-rescue/shared";
import { processWithdrawal } from "@/lib/admin-wallet-actions";

export default function AdminWalletClient({ withdrawals }: { withdrawals: any[] }) {
  const [loading, setLoading] = useState(false);

  async function handleAction(id: string, status: "completed" | "rejected") {
    if (!confirm(`Yakin ingin mengubah status menjadi ${status}?`)) return;
    setLoading(true);
    await processWithdrawal(id, status);
    setLoading(false);
  }

  const pending = withdrawals.filter(w => w.status === "pending");
  const history = withdrawals.filter(w => w.status !== "pending");

  return (
    <div className="flex flex-col gap-8">
      {pending.length > 0 && (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Perlu Diproses ({pending.length})</h2>
          <div className="flex flex-col gap-4">
            {pending.map(w => (
              <div key={w.id} className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">{w.merchants?.store_name}</p>
                  <p className="text-2xl font-black text-[#1b4332] my-1">{formatCurrency(w.amount)}</p>
                  <div className="text-sm text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 mt-2 w-fit">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Transfer Ke:</p>
                    <p className="font-bold">{w.bank_name} - <span className="font-mono">{w.account_number}</span></p>
                    <p className="text-xs">a.n {w.account_name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    disabled={loading}
                    onClick={() => handleAction(w.id, "completed")}
                    className="bg-[#2d6a4f] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#1b4332] transition-colors disabled:opacity-50"
                  >
                    Tandai Selesai
                  </button>
                  <button 
                    disabled={loading}
                    onClick={() => handleAction(w.id, "rejected")}
                    className="border border-red-200 text-red-600 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Riwayat Pencairan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Nominal</th>
                <th className="px-6 py-4">Rekening</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">Belum ada riwayat.</td>
                </tr>
              )}
              {history.map(w => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(w.processed_at || w.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{w.merchants?.store_name}</td>
                  <td className="px-6 py-4 font-black text-[#1b4332]">{formatCurrency(w.amount)}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">
                    <p className="font-bold">{w.bank_name}</p>
                    <p className="font-mono text-gray-500">{w.account_number}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      w.status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
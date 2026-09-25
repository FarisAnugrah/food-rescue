"use client";

import { useState } from "react";
import { formatCurrency } from "@food-rescue/shared";
import { requestWithdrawal } from "@/lib/wallet-actions";
import Link from "next/link";

export default function WalletClient({ balance, merchant, withdrawals }: { balance: number, merchant: any, withdrawals: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasBankInfo = merchant.bank_name && merchant.bank_account_number && merchant.bank_account_name;

  async function handleWithdraw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const res = await requestWithdrawal(formData);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Permintaan penarikan berhasil dibuat. Dana akan diproses admin.");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-3xl bg-[#1b4332] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2d6a4f] rounded-full blur-[80px] transform translate-x-1/2 -translate-y-1/2 opacity-50" />
        <p className="text-sm font-semibold text-[#95d5b2] uppercase tracking-widest mb-2">Saldo Aktif</p>
        <p className="text-4xl sm:text-5xl font-black tracking-tight">{formatCurrency(balance)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Tarik Saldo</h2>
          
          {!hasBankInfo ? (
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-center">
              <p className="text-sm text-orange-800 font-medium mb-3">Rekening bank belum diatur.</p>
              <Link href="/merchant/profile" className="text-xs font-bold text-white bg-orange-600 px-4 py-2 rounded-full hover:bg-orange-700 transition-colors">
                Atur Rekening di Profil
              </Link>
            </div>
          ) : (
            <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
              {error && <div className="text-xs font-medium text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>}
              {success && <div className="text-xs font-medium text-[#2d6a4f] bg-[#e8f5e9] p-3 rounded-xl">{success}</div>}

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Bank Tujuan</p>
                <p className="text-sm font-bold text-gray-900">{merchant.bank_name}</p>
                <p className="text-sm text-gray-600 font-mono">{merchant.bank_account_number}</p>
                <p className="text-xs text-gray-500 mt-1">a.n {merchant.bank_account_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Nominal Penarikan (Rp)</label>
                <input 
                  type="number" 
                  name="amount" 
                  required 
                  min="10000"
                  max={balance}
                  placeholder="Misal: 50000" 
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-black outline-none transition-colors" 
                />
                <p className="text-[10px] text-gray-500 mt-1.5">Minimal penarikan Rp 10.000</p>
              </div>

              <button 
                type="submit" 
                disabled={loading || balance < 10000}
                className="w-full rounded-full bg-black py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors mt-2"
              >
                {loading ? "Memproses..." : "Ajukan Penarikan"}
              </button>
            </form>
          )}
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Riwayat Penarikan</h2>
          
          <div className="flex-1 overflow-y-auto max-h-[300px]">
            {withdrawals.length === 0 ? (
              <div className="text-center text-gray-400 py-10 text-sm font-medium">Belum ada riwayat penarikan</div>
            ) : (
              <div className="flex flex-col gap-3">
                {withdrawals.map((w) => (
                  <div key={w.id} className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-black text-gray-900">{formatCurrency(w.amount)}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        w.status === "completed" ? "bg-green-100 text-green-700" :
                        w.status === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {w.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{w.bank_name} - {w.account_number}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-widest">
                      {new Date(w.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
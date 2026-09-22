"use client";

import { useState } from "react";
import { approveMerchant, rejectMerchant } from "@/lib/admin-actions";

export default function AdminActionButtons({ merchantId, userId }: { merchantId: string, userId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    await approveMerchant(merchantId, userId);
    setLoading(false);
  }

  async function handleReject() {
    if (!confirm("Yakin ingin menolak dan menghapus pendaftaran merchant ini?")) return;
    setLoading(true);
    await rejectMerchant(merchantId, userId);
    setLoading(false);
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleApprove} 
        disabled={loading}
        className="rounded-full bg-black px-6 py-2 text-xs font-bold text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        Approve
      </button>
      <button 
        onClick={handleReject}
        disabled={loading}
        className="rounded-full border border-gray-200 px-6 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
import { requireRole } from "@/lib/auth-checks";
import MerchantNav from "@/components/merchant/merchant-nav";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@food-rescue/shared";
import WalletClient from "./wallet-client";

export const dynamic = "force-dynamic";

export default async function MerchantWallet() {
  const { user } = await requireRole(["merchant"]);
  const supabase = await createClient();

  const { data: merchant } = await supabase.from("merchants").select("*").eq("user_id", user.id).single();

  const { data: realOrders } = await supabase
    .from("orders")
    .select(`total_price, listings!inner(merchant_id)`)
    .eq("listings.merchant_id", merchant.id)
    .eq("status", "picked_up");

  const total_revenue = (realOrders || []).reduce((acc, row) => acc + Number(row.total_price), 0);

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("merchant_id", merchant.id)
    .order("created_at", { ascending: false });

  const total_withdrawn = (withdrawals || [])
    .filter(w => w.status !== "rejected")
    .reduce((acc, row) => acc + Number(row.amount), 0);

  const current_balance = total_revenue - total_withdrawn;

  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantNav active="/merchant/wallet" />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl mb-1">Wallet & Pencairan</h1>
        <p className="text-sm text-gray-500 mb-8">Tarik pendapatan jualanmu ke rekening bank.</p>

        <WalletClient 
          balance={current_balance} 
          merchant={merchant} 
          withdrawals={withdrawals || []} 
        />
      </div>
    </div>
  );
}
import { requireRole } from "@/lib/auth-checks";
import AdminNav from "@/components/admin/admin-nav";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@food-rescue/shared";
import AdminWalletClient from "./wallet-client";

export const dynamic = "force-dynamic";

export default async function AdminWallet() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    await requireRole(["admin"]);
  }

  const supabase = await createClient();

  // Get all withdrawals
  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("*, merchants(store_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav active="/admin/wallet" />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl mb-1">Permintaan Penarikan</h1>
        <p className="text-sm text-gray-500 mb-8">Proses pencairan dana revenue merchant ke rekening mereka.</p>

        <AdminWalletClient withdrawals={withdrawals || []} />
      </div>
    </div>
  );
}
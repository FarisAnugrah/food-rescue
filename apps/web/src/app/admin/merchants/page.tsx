import AdminNav from "@/components/admin/admin-nav";
import { getPendingMerchants, getVerifiedMerchants } from "@/lib/admin-queries";
import AdminMerchantsClient from "./merchants-client";
import { requireRole } from "@/lib/auth-checks";

export const dynamic = "force-dynamic";

export default async function AdminMerchants() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    await requireRole(["admin"]);
  }

  const { data: pending } = await getPendingMerchants();
  const { data: verified } = await getVerifiedMerchants();

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <AdminNav active="/admin/merchants" />
      <AdminMerchantsClient initialPending={pending} initialVerified={verified} />
    </div>
  );
}
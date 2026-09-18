import { requireRole } from "@/lib/auth-checks";

export default async function MerchantLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    await requireRole(["merchant"]);
  }
  return <>{children}</>;
}
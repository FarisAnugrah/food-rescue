import { requireRole } from "@/lib/auth-checks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Dashboard | Food Rescue",
  description: "Kelola toko, surplus makanan, dan pencairan dana Anda.",
  robots: "noindex, nofollow"
};

export default async function MerchantLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    await requireRole(["merchant"]);
  }
  return <>{children}</>;
}

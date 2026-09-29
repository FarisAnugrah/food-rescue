import { requireRole } from "@/lib/auth-checks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Food Rescue",
  description: "Platform management and moderation tools.",
  robots: "noindex, nofollow"
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    await requireRole(["admin"]);
  }
  return <>{children}</>;
}

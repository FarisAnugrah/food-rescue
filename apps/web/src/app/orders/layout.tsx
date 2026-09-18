import { requireRole } from "@/lib/auth-checks";

export default async function OrdersLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    await requireRole(["consumer"]);
  }
  return <>{children}</>;
}
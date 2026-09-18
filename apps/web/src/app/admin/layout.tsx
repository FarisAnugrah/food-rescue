import { requireRole } from "@/lib/auth-checks";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    await requireRole(["admin"]);
  }
  return <>{children}</>;
}
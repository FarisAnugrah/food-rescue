import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Ambil role dari tabel users
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "consumer";

  // Redirect ke halaman yang sesuai berdasarkan role
  if (role === "admin") {
    redirect("/admin");
  } else if (role === "merchant") {
    redirect("/merchant");
  } else {
    // Consumer langsung ke halaman utama belanja
    redirect("/listings");
  }
}

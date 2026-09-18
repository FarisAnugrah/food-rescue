import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export async function requireRole(allowedRoles: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "consumer";

  if (!allowedRoles.includes(role)) {
    // If not authorized, send them to their respective dashboard
    if (role === "admin") redirect("/admin");
    if (role === "merchant") redirect("/merchant");
    redirect("/listings");
  }

  return { user, profile };
}
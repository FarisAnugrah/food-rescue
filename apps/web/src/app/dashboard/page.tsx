import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/auth-actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500">
        Selamat datang, {user.user_metadata?.name || user.email}
      </p>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Logout
        </button>
      </form>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/auth-actions";
import ProfileForm from "./profile-form";
import NotificationBell from "@/components/notification-bell";

export const dynamic = "force-dynamic";

export default async function ConsumerProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/login");
  
  if (profile.role === "merchant") redirect("/merchant/profile");

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/listings" className="text-lg font-bold text-gray-900 tracking-tight">
            Food Rescue
          </Link>
          <div className="flex gap-4 items-center text-sm font-medium text-gray-600">
            <Link href="/listings" className="hover:text-black">Beranda</Link>
            <Link href="/orders" className="hover:text-black">Order</Link>
            <NotificationBell />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil</h1>

        <ProfileForm userProfile={profile} />

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Aksi Lainnya</h2>
          <div className="space-y-4">
            <Link href="/impact" className="block text-gray-600 hover:text-black">
              Lihat Impact & Badge Saya
            </Link>
            
            <form action={logout}>
              <button type="submit" className="text-red-600 hover:text-red-800 text-left w-full">
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/auth-actions";
import ProfileForm from "./profile-form";
import NotificationBell from "@/components/notification-bell";
import { Award } from "lucide-react";

import { requireRole } from "@/lib/auth-checks";

export const dynamic = "force-dynamic";

export default async function ConsumerProfilePage() {
  let profile = null;
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const auth = await requireRole(["consumer"]);
    profile = auth.profile;
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");
    const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
    profile = data;
    if (!profile) redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/listings" className="text-xl font-bold tracking-tight text-[#1b4332]">
            food<span className="text-[#2d6a4f]">rescue</span>
          </Link>
          <div className="flex gap-4 items-center text-sm font-medium text-[#555]">
            <Link href="/listings" className="hover:text-[#2d6a4f] transition-colors">Beranda</Link>
            <Link href="/orders" className="hover:text-[#2d6a4f] transition-colors">Order</Link>
            <div className="pl-4 border-l border-[#e8e4d4]">
              <NotificationBell />
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-10 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1b4332]">Profil Saya</h1>
          <p className="text-[#888]">Atur detail akun dan preferensi notifikasimu.</p>
        </div>

        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6 shadow-sm">
          <ProfileForm userProfile={profile} />
        </div>

        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6 shadow-sm">
          <h2 className="font-bold text-[#1b4332] mb-4">Pusat Bantuan & Aksi</h2>
          <div className="flex flex-col gap-3">
            <Link href="/impact" className="rounded-xl border border-[#e8e4d4] p-4 flex justify-between items-center hover:border-[#2d6a4f] hover:bg-[#e8f5e9] transition-colors">
              <span className="font-semibold text-[#1b4332] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2d6a4f]" />
                Lihat Impact & Badge Saya
              </span>
              <span className="text-[#2d6a4f]">→</span>
            </Link>
            
            <form action={logout} className="w-full">
              <button type="submit" className="w-full rounded-xl border border-red-200 bg-red-50 py-3 font-bold text-red-600 hover:bg-red-100 transition-colors mt-2">
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
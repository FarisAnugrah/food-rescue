import MerchantNav from "@/components/merchant/merchant-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

export const dynamic = "force-dynamic";

export default async function MerchantProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!merchant) redirect("/merchant");

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <MerchantNav active="/merchant/profile" />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1b4332] mb-2">Profil Toko</h1>
        <p className="text-[#888] mb-8">Lengkapi informasi toko agar mudah ditemukan konsumen.</p>
        
        <div className="rounded-2xl bg-white border border-[#e8e4d4] p-6">
          <ProfileForm merchant={merchant} />
        </div>
      </div>
    </div>
  );
}
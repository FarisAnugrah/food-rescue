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
    <div className="min-h-screen bg-white">
      <MerchantNav active="/merchant/profile" />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Toko</h1>
        
        <ProfileForm merchant={merchant} />
      </div>
    </div>
  );
}
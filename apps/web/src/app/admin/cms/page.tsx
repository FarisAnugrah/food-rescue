import { requireRole } from "@/lib/auth-checks";
import AdminNav from "@/components/admin/admin-nav";
import { getLandingPageData } from "@/lib/cms-queries";
import CmsClient from "./cms-client";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    await requireRole(["admin"]);
  }

  const { assets } = await getLandingPageData();

  // Get raw testimonials including inactive ones (getLandingPageData only returns active)
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav active="/admin/cms" />
      <CmsClient initialAssets={assets} initialTestimonials={testimonials || []} />
    </div>
  );
}
"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function updateMerchantProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Unauthorized" };

  const store_name = formData.get("store_name") as string;
  const description = formData.get("description") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const lat = parseFloat(formData.get("lat") as string) || 0;
  const lng = parseFloat(formData.get("lng") as string) || 0;

  let photo_url = undefined;
  const file = formData.get("photo") as File;
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop();
    const fileName = `merchant-${user.id}-${Date.now()}.${ext}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("listings") // reuse listings bucket for simplicity
      .upload(fileName, file);
      
    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage.from("listings").getPublicUrl(fileName);
      photo_url = publicUrlData.publicUrl;
    }
  }

  const updates: any = { store_name, description, phone, address, lat, lng };
  if (photo_url) updates.photo_url = photo_url;

  const { error } = await supabase
    .from("merchants")
    .update(updates)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/merchant/profile");
  return { success: true };
}
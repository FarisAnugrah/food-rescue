"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function updateConsumerProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  let avatar_url = undefined;
  
  const file = formData.get("avatar") as File;
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop();
    const fileName = `avatar-${user.id}-${Date.now()}.${ext}`;
    // Using the same 'listings' bucket for simplicity since it's already created & public
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("listings")
      .upload(fileName, file);
      
    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage.from("listings").getPublicUrl(fileName);
      avatar_url = publicUrlData.publicUrl;
    }
  }

  const updates: any = { name };
  if (avatar_url) updates.avatar_url = avatar_url;

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return { success: true };
}
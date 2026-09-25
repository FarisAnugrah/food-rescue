"use client";

import { useState } from "react";
import { updateConsumerProfile } from "@/lib/user-actions";
import { User } from "lucide-react";
import { validateImageFile } from "@food-rescue/shared";

export default function ProfileForm({ userProfile }: { userProfile: any }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [notifPickup, setNotifPickup] = useState(true);
  const [notifPromo, setNotifPromo] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    
    const formData = new FormData(e.currentTarget);
    
    const avatarFile = formData.get("avatar") as File;
    const fileErr = validateImageFile(avatarFile);
    if (fileErr) {
      setMsg({ text: fileErr, type: "error" });
      setLoading(false);
      return;
    }

    const res = await updateConsumerProfile(formData);
    
    if (res.error) {
      setMsg({ text: res.error, type: "error" });
    } else {
      setMsg({ text: "Profil berhasil diperbarui!", type: "success" });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {msg.text && (
        <div className={`p-3 rounded-xl text-sm font-medium ${msg.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {msg.text}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          {userProfile.avatar_url ? (
            <img src={userProfile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-[#e8e4d4]" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#f0ede0] flex items-center justify-center text-[#2d6a4f]">
               <User className="w-8 h-8" />
            </div>
          )}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Ganti Foto (Opsional)</label>
            <input name="avatar" type="file" accept="image/*" className="w-full text-sm text-[#555] file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-[#e8f5e9] file:text-[#2d6a4f] file:font-semibold hover:file:bg-[#d8f3dc] cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Nama Lengkap</label>
          <input name="name" defaultValue={userProfile.name} required className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2.5 text-sm focus:border-[#2d6a4f] outline-none transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Email</label>
          <input defaultValue={userProfile.email} disabled className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2.5 text-sm text-gray-400 bg-gray-50 outline-none cursor-not-allowed" />
        </div>

        <div className="pt-6 mt-2 border-t border-[#e8e4d4]">
          <h3 className="font-bold text-[#1b4332] mb-4">Preferensi Notifikasi</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#333]">Reminder Pickup</p>
                <p className="text-xs text-[#888]">Diingatkan 30 menit sebelum toko tutup</p>
              </div>
              <input type="checkbox" checked={notifPickup} onChange={(e) => setNotifPickup(e.target.checked)} className="accent-[#2d6a4f] w-5 h-5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#333]">Promo & Surprise Bag</p>
                <p className="text-xs text-[#888]">Info diskon dari merchant favoritmu</p>
              </div>
              <input type="checkbox" checked={notifPromo} onChange={(e) => setNotifPromo(e.target.checked)} className="accent-[#2d6a4f] w-5 h-5" />
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-full bg-[#2d6a4f] py-3.5 mt-2 text-sm font-bold text-white hover:bg-[#1b4332] disabled:opacity-50 transition-colors">
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
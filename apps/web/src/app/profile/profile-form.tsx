"use client";

import { useState } from "react";
import { updateConsumerProfile } from "@/lib/user-actions";
import { User } from "lucide-react";

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
            <img src={userProfile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover bg-gray-100" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
               <User className="w-8 h-8" />
            </div>
          )}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-900 mb-1">Ubah Foto</label>
            <input name="avatar" type="file" accept="image/*" className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-900 hover:file:bg-gray-200 cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Nama Lengkap</label>
          <input name="name" defaultValue={userProfile.name} required className="w-full border-b border-gray-300 py-2 text-gray-900 focus:border-black outline-none bg-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
          <input defaultValue={userProfile.email} disabled className="w-full border-b border-gray-200 py-2 text-gray-500 outline-none bg-transparent cursor-not-allowed" />
        </div>

        <div className="pt-6 mt-2 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Notifikasi</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Reminder Pickup</span>
              <input type="checkbox" checked={notifPickup} onChange={(e) => setNotifPickup(e.target.checked)} className="accent-black w-4 h-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Promo & Surprise Bag</span>
              <input type="checkbox" checked={notifPromo} onChange={(e) => setNotifPromo(e.target.checked)} className="accent-black w-4 h-4" />
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-fit bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 disabled:opacity-50 mt-4">
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
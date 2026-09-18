"use client";

import { useState } from "react";
import { updateMerchantProfile } from "@/lib/merchant-actions";

export default function ProfileForm({ merchant }: { merchant: any }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [coords, setCoords] = useState({ lat: merchant.lat || "", lng: merchant.lng || "" });
  const [address, setAddress] = useState(merchant.address || "");

  function getLocation() {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({
            lat: lat.toString(),
            lng: lng.toString(),
          });

          // Reverse Geocoding via OpenStreetMap (gratis, tanpa API Key)
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            }
          } catch (err) {
            console.error("Gagal mendapatkan nama jalan", err);
          }
          setLoading(false);
        },
        (error) => {
          alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Browser tidak mendukung Geolocation.");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    
    const formData = new FormData(e.currentTarget);
    const res = await updateMerchantProfile(formData);
    
    if (res.error) {
      setMsg({ text: res.error, type: "error" });
    } else {
      setMsg({ text: "Profil berhasil diperbarui!", type: "success" });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {msg.text && (
        <div className={`p-3 rounded-xl text-sm ${msg.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {msg.text}
        </div>
      )}

      {merchant.photo_url && (
        <div className="mb-4">
          <img src={merchant.photo_url} alt="Logo" className="w-24 h-24 rounded-xl object-cover border border-[#e8e4d4]" />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1">Logo / Foto Toko</label>
        <input name="photo" type="file" accept="image/*" className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2 bg-white text-sm" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1">Nama Toko</label>
        <input name="store_name" defaultValue={merchant.store_name} required className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2 bg-white text-sm focus:border-[#2d6a4f] outline-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1">Deskripsi Singkat</label>
        <textarea name="description" defaultValue={merchant.description} rows={3} className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2 bg-white text-sm focus:border-[#2d6a4f] outline-none resize-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1">Telepon / WA</label>
        <input name="phone" defaultValue={merchant.phone} className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2 bg-white text-sm focus:border-[#2d6a4f] outline-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1">Alamat Lengkap</label>
        <textarea name="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} required className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2 bg-white text-sm focus:border-[#2d6a4f] outline-none resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#1b4332] mb-1">Latitude</label>
          <input name="lat" type="number" step="any" value={coords.lat} onChange={(e) => setCoords({...coords, lat: e.target.value})} className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2 bg-white text-sm focus:border-[#2d6a4f] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1b4332] mb-1">Longitude</label>
          <input name="lng" type="number" step="any" value={coords.lng} onChange={(e) => setCoords({...coords, lng: e.target.value})} className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2 bg-white text-sm focus:border-[#2d6a4f] outline-none" />
        </div>
      </div>
      
      <button type="button" onClick={getLocation} className="w-fit text-sm font-medium text-[#2d6a4f] hover:underline flex items-center gap-1">
        📍 Deteksi Lokasi Otomatis
      </button>

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#2d6a4f] py-3 mt-4 text-sm font-bold text-white hover:bg-[#1b4332] disabled:opacity-50 transition-colors">
        {loading ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
}
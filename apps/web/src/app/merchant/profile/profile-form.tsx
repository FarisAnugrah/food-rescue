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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {msg.text && (
        <div className={`p-3 rounded text-sm ${msg.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {msg.text}
        </div>
      )}

      <div className="flex items-center gap-4">
        {merchant.photo_url ? (
          <img src={merchant.photo_url} alt="Logo" className="w-16 h-16 rounded object-cover bg-gray-100" />
        ) : (
          <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-400">
            Logo
          </div>
        )}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-900 mb-1">Upload Logo</label>
          <input name="photo" type="file" accept="image/*" className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-900 hover:file:bg-gray-200 cursor-pointer" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Nama Toko</label>
        <input name="store_name" defaultValue={merchant.store_name} required className="w-full border-b border-gray-300 py-2 text-gray-900 focus:border-black outline-none bg-transparent" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Deskripsi Singkat</label>
        <textarea name="description" defaultValue={merchant.description} rows={2} className="w-full border-b border-gray-300 py-2 text-gray-900 focus:border-black outline-none bg-transparent resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Telepon / WA</label>
        <input name="phone" defaultValue={merchant.phone} className="w-full border-b border-gray-300 py-2 text-gray-900 focus:border-black outline-none bg-transparent" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Alamat Lengkap</label>
        <textarea name="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} required className="w-full border-b border-gray-300 py-2 text-gray-900 focus:border-black outline-none bg-transparent resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Latitude</label>
          <input name="lat" type="number" step="any" value={coords.lat} onChange={(e) => setCoords({...coords, lat: e.target.value})} className="w-full border-b border-gray-300 py-2 text-gray-900 focus:border-black outline-none bg-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Longitude</label>
          <input name="lng" type="number" step="any" value={coords.lng} onChange={(e) => setCoords({...coords, lng: e.target.value})} className="w-full border-b border-gray-300 py-2 text-gray-900 focus:border-black outline-none bg-transparent" />
        </div>
      </div>
      
      <button type="button" onClick={getLocation} className="w-fit text-sm text-black underline font-medium mt-[-10px]">
        Deteksi Lokasi GPS
      </button>

      <button type="submit" disabled={loading} className="w-fit bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 disabled:opacity-50 mt-4">
        {loading ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
}
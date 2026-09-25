"use client";

import { useState } from "react";
import { updateMerchantProfile } from "@/lib/merchant-actions";

import { MapPin } from "lucide-react";

import { validateImageFile } from "@food-rescue/shared";

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
    
    const photoFile = formData.get("photo") as File;
    const ktpFile = formData.get("ktp") as File;
    
    const photoErr = validateImageFile(photoFile);
    const ktpErr = validateImageFile(ktpFile);
    
    if (photoErr || ktpErr) {
      setMsg({ text: photoErr || ktpErr || "File tidak valid", type: "error" });
      setLoading(false);
      return;
    }

    const res = await updateMerchantProfile(formData);
    
    if (res.error) {
      setMsg({ text: res.error, type: "error" });
    } else {
      setMsg({ text: "Profil berhasil diperbarui!", type: "success" });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" encType="multipart/form-data">
      {msg.text && (
        <div className={`p-3 rounded text-sm ${msg.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {msg.text}
        </div>
      )}

      <div className="flex items-center gap-4">
        {merchant.photo_url ? (
          <img src={merchant.photo_url} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-[#e8e4d4]" />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-[#f0ede0] flex items-center justify-center text-[#2d6a4f] text-sm font-bold">
            Logo
          </div>
        )}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-[#1b4332] mb-1">Upload Logo</label>
          <input name="photo" type="file" accept="image/*" className="w-full text-sm text-[#555] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#e8f5e9] file:text-[#2d6a4f] hover:file:bg-[#d8f3dc] cursor-pointer" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Nama Pemilik</label>
        <input name="owner_name" defaultValue={merchant.owner_name} placeholder="Sesuai KTP" required className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2.5 text-sm focus:border-[#2d6a4f] outline-none transition-colors" />
      </div>

      <div className="flex items-center gap-4">
        {merchant.ktp_url ? (
          <img src={merchant.ktp_url} alt="KTP" className="w-24 h-16 rounded-xl object-cover border border-[#e8e4d4]" />
        ) : (
          <div className="w-24 h-16 rounded-xl bg-[#f0ede0] flex items-center justify-center text-[#2d6a4f] text-sm font-bold">
            KTP
          </div>
        )}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-[#1b4332] mb-1">Upload KTP (Untuk Verifikasi)</label>
          <input name="ktp" type="file" accept="image/*" className="w-full text-sm text-[#555] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#e8f5e9] file:text-[#2d6a4f] hover:file:bg-[#d8f3dc] cursor-pointer" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Nama Toko</label>
        <input name="store_name" defaultValue={merchant.store_name} required className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2.5 text-sm focus:border-[#2d6a4f] outline-none transition-colors" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Deskripsi Singkat</label>
        <textarea name="description" defaultValue={merchant.description} rows={2} className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2.5 text-sm focus:border-[#2d6a4f] outline-none transition-colors resize-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Telepon / WA</label>
        <input name="phone" defaultValue={merchant.phone} className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2.5 text-sm focus:border-[#2d6a4f] outline-none transition-colors" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Alamat Lengkap</label>
        <textarea name="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} required className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2.5 text-sm focus:border-[#2d6a4f] outline-none transition-colors resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Latitude</label>
          <input name="lat" type="number" step="any" value={coords.lat} onChange={(e) => setCoords({...coords, lat: e.target.value})} className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2.5 text-sm focus:border-[#2d6a4f] outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1b4332] mb-1.5">Longitude</label>
          <input name="lng" type="number" step="any" value={coords.lng} onChange={(e) => setCoords({...coords, lng: e.target.value})} className="w-full rounded-xl border border-[#e8e4d4] px-4 py-2.5 text-sm focus:border-[#2d6a4f] outline-none transition-colors" />
        </div>
      </div>
      
      <button type="button" onClick={getLocation} className="w-fit text-sm font-semibold text-[#2d6a4f] hover:underline flex items-center gap-1.5 mt-[-8px]">
        <MapPin className="w-4 h-4" /> Deteksi Lokasi Otomatis
      </button>

      <div className="pt-2">
        <button type="submit" disabled={loading} className="w-full rounded-full bg-[#2d6a4f] py-3.5 text-sm font-bold text-white hover:bg-[#1b4332] disabled:opacity-50 transition-colors">
          {loading ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </div>
    </form>
  );
}
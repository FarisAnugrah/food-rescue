"use client";

import { useState } from "react";
import { updateLandingAsset, updateTestimonial, toggleTestimonialStatus } from "@/lib/cms-actions";

export default function CmsClient({ initialAssets, initialTestimonials }: { initialAssets: any, initialTestimonials: any[] }) {
  const [loading, setLoading] = useState(false);
  const [heroUrl, setHeroUrl] = useState(initialAssets.hero_image || "/images/hero.webp");
  const [ctaUrl, setCtaUrl] = useState(initialAssets.merchant_cta_image || "/images/merchant-cta.webp");
  
  // Testimonial Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tQuote, setTQuote] = useState("");
  const [tName, setTName] = useState("");
  const [tRole, setTRole] = useState("");

  async function handleSaveAssets() {
    setLoading(true);
    await updateLandingAsset("hero_image", heroUrl);
    await updateLandingAsset("merchant_cta_image", ctaUrl);
    alert("Gambar berhasil di-update!");
    setLoading(false);
  }

  function startEdit(t: any) {
    setEditingId(t.id);
    setTQuote(t.quote);
    setTName(t.name);
    setTRole(t.role);
  }

  function startNew() {
    setEditingId("new");
    setTQuote("");
    setTName("");
    setTRole("");
  }

  async function handleSaveTestimonial() {
    if (!editingId) return;
    setLoading(true);
    await updateTestimonial(editingId, tQuote, tName, tRole);
    setEditingId(null);
    setLoading(false);
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    setLoading(true);
    await toggleTestimonialStatus(id, !currentStatus);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl mb-1">Content Management</h1>
      <p className="text-sm text-gray-500 mb-8">Atur tampilan dan teks di Landing Page</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">Landing Page Images</h2>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Image URL</label>
            <input 
              value={heroUrl} 
              onChange={e => setHeroUrl(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black outline-none transition-colors"
            />
            {heroUrl && <img src={heroUrl} alt="Preview Hero" className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-100" />}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 mt-2">Merchant CTA Image URL</label>
            <input 
              value={ctaUrl} 
              onChange={e => setCtaUrl(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black outline-none transition-colors"
            />
            {ctaUrl && <img src={ctaUrl} alt="Preview CTA" className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-100" />}
          </div>

          <button 
            onClick={handleSaveAssets} 
            disabled={loading}
            className="w-full rounded-full bg-black mt-2 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Gambar"}
          </button>
        </div>

        {/* Testimonials List */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Daftar Testimoni</h2>
            {!editingId && (
              <button onClick={startNew} className="text-sm font-bold text-[#2d6a4f] hover:underline">
                + Tambah Baru
              </button>
            )}
          </div>

          {editingId ? (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
              <h3 className="font-bold text-gray-900 text-sm">{editingId === "new" ? "Tambah Testimoni" : "Edit Testimoni"}</h3>
              <textarea 
                placeholder="Quote / Pesan testimoni..." 
                value={tQuote} onChange={e => setTQuote(e.target.value)} 
                rows={3} 
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black outline-none resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Nama (Cth: Budi S.)" value={tName} onChange={e => setTName(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black outline-none" />
                <input placeholder="Role (Cth: Consumer)" value={tRole} onChange={e => setTRole(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black outline-none" />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setEditingId(null)} className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">Batal</button>
                <button onClick={handleSaveTestimonial} disabled={loading} className="px-4 py-1.5 text-xs font-bold bg-[#2d6a4f] text-white rounded-full hover:bg-[#1b4332] disabled:opacity-50">Simpan</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {initialTestimonials.map(t => (
                <div key={t.id} className={`p-4 rounded-xl border transition-colors ${t.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                  <p className="text-sm text-gray-700 italic mb-2">"{t.quote}"</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{t.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">{t.role}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleToggle(t.id, t.is_active)} disabled={loading} className={`text-xs font-bold ${t.is_active ? 'text-red-500 hover:text-red-700' : 'text-[#2d6a4f] hover:text-[#1b4332]'}`}>
                        {t.is_active ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                      <button onClick={() => startEdit(t)} className="text-xs font-bold text-gray-500 hover:text-black">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
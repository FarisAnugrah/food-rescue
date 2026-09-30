"use client";

import { useState } from "react";
import AdminNav from "@/components/admin/admin-nav";

export default function FormBuilder() {
  const [fields, setFields] = useState([{ id: 1, type: "text", label: "Contoh Input" }]);

  const addField = () => {
    setFields([...fields, { id: Date.now(), type: "text", label: "Input Baru" }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav active="/admin/form-builder" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Form Builder (Eksperimental)</h1>
        <p className="text-gray-500 mb-8">Buat kuesioner dinamis untuk merchant atau konsumen.</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col gap-4">
            {fields.map((f, i) => (
              <div key={f.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-400">{i + 1}.</span>
                <input 
                  type="text" 
                  defaultValue={f.label} 
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-black"
                />
                <select className="px-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-black">
                  <option value="text">Teks Pendek</option>
                  <option value="textarea">Paragraf</option>
                  <option value="checkbox">Pilihan Ganda</option>
                </select>
                <button onClick={() => removeField(f.id)} className="text-red-500 text-sm font-bold px-3 py-2 hover:bg-red-50 rounded-lg">Hapus</button>
              </div>
            ))}
          </div>
          
          <button onClick={addField} className="mt-6 px-6 py-3 bg-gray-100 text-gray-900 text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">
            + Tambah Kolom
          </button>
        </div>

        <button className="px-8 py-3 bg-[#2d6a4f] text-white text-sm font-bold rounded-full hover:bg-[#1b4332] shadow-md">
          Simpan Form
        </button>
      </div>
    </div>
  );
}

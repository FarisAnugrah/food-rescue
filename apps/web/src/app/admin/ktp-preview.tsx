"use client";

import { useState } from "react";

export default function KtpPreview({ url }: { url: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="inline-block mt-2 text-xs font-bold text-[#2d6a4f] hover:underline cursor-pointer"
      >
        Lihat KTP
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative max-w-3xl w-full">
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute -top-12 right-0 text-white font-bold text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
            >
              Tutup
            </button>
            <img src={url} alt="KTP Preview" className="w-full rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </>
  );
}
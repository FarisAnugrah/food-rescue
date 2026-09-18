"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          setHasUnread(false);
        }}
        className="relative flex items-center justify-center w-8 h-8 rounded-full text-[#555] hover:bg-[#d8f3dc] hover:text-[#2d6a4f] transition-colors"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e63946] rounded-full border border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e8e4d4] overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[#e8e4d4] flex justify-between items-center bg-[#fafaf7]">
            <span className="font-bold text-[#1b4332] text-sm">Notifikasi</span>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-[#888]">Belum ada notifikasi baru.</p>
          </div>
        </div>
      )}
    </div>
  );
}

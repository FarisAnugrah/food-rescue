"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { getUserNotifications, markNotificationsAsRead } from "@/lib/notification-actions";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    getUserNotifications().then((res) => {
      setNotifications(res.data);
      if (res.data.some((n: any) => !n.is_read)) {
        setHasUnread(true);
      }
    });
  }, []);

  async function handleOpen() {
    setIsOpen(!isOpen);
    if (!isOpen && hasUnread) {
      setHasUnread(false);
      await markNotificationsAsRead();
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="relative flex items-center justify-center w-8 h-8 rounded-full text-[#555] hover:bg-[#d8f3dc] hover:text-[#2d6a4f] transition-colors"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e63946] rounded-full border border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e8e4d4] overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[#e8e4d4] bg-[#fafaf7]">
            <span className="font-bold text-[#1b4332] text-sm">Notifikasi</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-[#888]">Belum ada notifikasi baru.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#e8e4d4]">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 hover:bg-[#fafaf7] transition-colors ${!n.is_read ? "bg-[#fefae0]/50" : ""}`}>
                    <p className="font-semibold text-[#1b4332] text-sm mb-1">{n.title}</p>
                    <p className="text-xs text-[#555] leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-[#aaa] mt-2">
                      {new Date(n.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

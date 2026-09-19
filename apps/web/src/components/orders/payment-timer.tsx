"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function PaymentTimer({ createdAt, durationMinutes = 15 }: { createdAt: string, durationMinutes?: number }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const expireTime = new Date(createdAt).getTime() + (durationMinutes * 60 * 1000);

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((expireTime - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [createdAt, durationMinutes]);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");

  if (timeLeft === 0) {
    return (
      <div className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold mb-2 inline-block">
        Waktu Habis
      </div>
    );
  }

  return (
    <div className="bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-sm font-bold mb-2 flex items-center gap-2 w-fit mx-auto">
      <Clock className="w-4 h-4" /> Selesaikan dalam {m}:{s}
    </div>
  );
}
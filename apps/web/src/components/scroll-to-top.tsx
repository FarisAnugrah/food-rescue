"use client";

import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    // Memaksa browser scroll ke atas saat komponen ini di mount (halaman pertama kali load)
    // Walaupun ada hash / anchor di URL
    if (window.location.hash) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 10);
    }
  }, []);

  return null;
}

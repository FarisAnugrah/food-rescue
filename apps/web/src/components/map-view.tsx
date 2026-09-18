"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { formatCurrency } from "@food-rescue/shared";

// Fix Leaflet missing marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({ listings }: { listings: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([-6.2088, 106.8456], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers to prevent duplicates on re-render
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers
    listings.forEach((l, index) => {
      const lat = l.lat || (-6.2088 + (index * 0.01));
      const lng = l.lng || (106.8456 + (index * 0.01));

      const popupContent = `
        <div style="display:flex;flex-direction:column;gap:4px;min-width:180px;">
          <strong style="color:#1b4332;font-size:14px;">${l.title}</strong>
          <span style="color:#888;font-size:12px;">${l.merchant_name}</span>
          <span style="color:#2d6a4f;font-weight:bold;">${formatCurrency(l.discounted_price)}</span>
          <a href="/listings/${l.id}" style="margin-top:8px;text-align:center;border-radius:6px;background-color:#2d6a4f;color:white;padding:6px;font-size:12px;font-weight:bold;text-decoration:none;">
            Lihat Detail
          </a>
        </div>
      `;

      L.marker([lat, lng]).addTo(map).bindPopup(popupContent);
    });

    return () => {
      // We don't necessarily want to destroy the map on every re-render,
      // but if the component unmounts, we should clean it up.
    };
  }, [listings]);

  // Clean up on unmount completely
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-[#e8e4d4] z-0 relative">
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
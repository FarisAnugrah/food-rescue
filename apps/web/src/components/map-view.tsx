"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { formatCurrency } from "@food-rescue/shared";

// Fix Leaflet missing marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({ listings }: { listings: any[] }) {
  // Default to Jakarta
  const center: [number, number] = [-6.2088, 106.8456];

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-[#e8e4d4] z-0">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listings.map((l) => {
          // If the listing doesn't have lat/lng (dummy data), we give it a random coordinate near Jakarta for demo purposes.
          const lat = l.merchants?.lat || (-6.2088 + (Math.random() - 0.5) * 0.1);
          const lng = l.merchants?.lng || (106.8456 + (Math.random() - 0.5) * 0.1);

          return (
            <Marker key={l.id} position={[lat, lng]}>
              <Popup>
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <span className="font-bold text-[#1b4332] text-base">{l.title}</span>
                  <span className="text-xs text-[#888]">{l.merchant_name}</span>
                  <span className="font-bold text-[#2d6a4f]">{formatCurrency(l.discounted_price)}</span>
                  <Link href={`/listings/${l.id}`} className="mt-2 text-center rounded-lg bg-[#2d6a4f] py-1.5 text-xs font-bold text-white hover:bg-[#1b4332]">
                    Lihat Detail
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
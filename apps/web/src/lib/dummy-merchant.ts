import type { Order, Listing } from "@food-rescue/shared";

export const DUMMY_MERCHANT_STATS = {
  total_kg_saved: 127.5,
  total_co2_prevented: 318.75,
  total_revenue: 3450000,
  total_orders: 89,
  rating: 4.7,
  active_listings: 3,
};

export const DUMMY_MERCHANT_ORDERS: (Order & { listing_title: string; consumer_name: string })[] = [
  {
    id: "o1", user_id: "u1", listing_id: "1", quantity: 1, total_price: 25000, total_weight_kg: 1.5,
    qr_code: "FR-O1-ABC123", status: "paid", created_at: "2026-09-17T16:30:00", picked_up_at: null,
    listing_title: "Surprise Bag — Roti & Pastry", consumer_name: "Andi Pratama",
  },
  {
    id: "o2", user_id: "u2", listing_id: "1", quantity: 2, total_price: 50000, total_weight_kg: 3.0,
    qr_code: "FR-O2-DEF456", status: "paid", created_at: "2026-09-17T16:45:00", picked_up_at: null,
    listing_title: "Surprise Bag — Roti & Pastry", consumer_name: "Siti Rahayu",
  },
  {
    id: "o3", user_id: "u3", listing_id: "4", quantity: 1, total_price: 18000, total_weight_kg: 1.2,
    qr_code: "FR-O3-GHI789", status: "picked_up", created_at: "2026-09-17T14:20:00", picked_up_at: "2026-09-17T15:10:00",
    listing_title: "Aneka Kue Tradisional", consumer_name: "Budi Santoso",
  },
  {
    id: "o4", user_id: "u4", listing_id: "2", quantity: 1, total_price: 15000, total_weight_kg: 0.8,
    qr_code: "FR-O4-JKL012", status: "expired", created_at: "2026-09-16T17:10:00", picked_up_at: null,
    listing_title: "Nasi Campur Komplit", consumer_name: "Dewi Lestari",
  },
];

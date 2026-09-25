export type UserRole = "consumer" | "merchant" | "admin";

export type ListingType = "surprise_bag" | "specific";

export type ListingStatus = "active" | "sold_out" | "expired";

export type OrderStatus = "pending" | "paid" | "picked_up" | "expired" | "cancelled";

export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Merchant {
  id: string;
  user_id: string;
  store_name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  photo_url: string | null;
  is_halal: boolean;
  verified: boolean;
  rating: number;
  total_kg_saved: number;
  created_at: string;
}

export interface Listing {
  id: string;
  merchant_id: string;
  title: string;
  description: string;
  photo_url: string | null;
  category: string;
  is_halal: boolean;
  original_price: number;
  discounted_price: number;
  weight_kg: number;
  quantity: number;
  quantity_sold: number;
  pickup_start: string;
  pickup_end: string;
  type: ListingType;
  status: ListingStatus;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  listing_id: string;
  quantity: number;
  total_price: number;
  total_weight_kg: number;
  qr_code: string;
  status: OrderStatus;
  created_at: string;
  picked_up_at: string | null;
}

export interface Review {
  id: string;
  order_id: string;
  user_id: string;
  merchant_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  midtrans_ref: string;
  created_at: string;
}

export interface ImpactLog {
  id: string;
  order_id: string;
  food_kg: number;
  co2_kg: number;
  created_at: string;
}

export type AuthRole = "consumer" | "merchant" | "admin";

export interface GeoLocation {
  lat: number;
  lng: number;
}

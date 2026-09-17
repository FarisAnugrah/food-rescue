# Software Requirements Specification (SRS)

## 1. Introduction
Marketplace platform yang menghubungkan merchant HOREKA (Hotel, Restoran, Katering) dan retail yang memiliki surplus makanan dengan konsumen. Platform tersedia dalam bentuk web (Next.js) dan mobile (React Native).

## 2. Functional Requirements

### 2.1 Authentication
- Email/password & Google OAuth login.
- Role-based access: consumer, merchant, admin.
- Merchant registration requires document verification (nama usaha, alamat, foto lokasi).

### 2.2 Consumer Features
- View listings nearby via map & list view.
- Filter: jarak, kategori makanan, harga, pickup window, halal/non-halal.
- View listing detail: foto, harga asli vs diskon, estimasi berat (kg), pickup window.
- Order & payment via Midtrans (e-wallet, VA, QRIS).
- Receive QR code setelah payment sukses.
- Personal impact dashboard: kg food saved, CO2 prevented, badges.
- Review & rating merchant setelah pickup.

### 2.3 Merchant Features
- Post listing: surprise bag atau specific item.
- Set harga asli, harga diskon, kuota, estimasi berat (kg), pickup window.
- Label halal/non-halal.
- Minimum total listing: 5 kg (mengikuti standar FoodCycle).
- Receive order notifications.
- Scan QR code untuk verifikasi pickup.
- Analytics dashboard: revenue, food saved (kg), CO2 prevented, rating.
- Food Waste Warrior badge system (berdasarkan total kg rescued).

### 2.4 Admin Features
- Review & approve/reject merchant applications.
- Monitor & flag/takedown listings.
- View platform-wide impact dashboard.
- Merchant leaderboard (top food rescuers).
- Manage food safety guidelines content.

### 2.5 Impact Tracking
- CO2 calculation: kg_food_saved × 2.5 = kg_CO2_prevented.
- Real-time global impact counter on home screen.
- Weekly impact summary notifications.

## 3. Non-Functional Requirements
- **Performance:** API response <200ms, app load <2s on 4G.
- **Scalability:** Handle 500 concurrent users (MVP), horizontally scalable.
- **Security:** Encrypted passwords (bcrypt), secure payment tokens, HTTPS only.
- **Availability:** 99.9% uptime.
- **Food Safety:** Pickup window max 4 jam dari posting, auto-expire listings.
- **Localization:** Bahasa Indonesia primary, English secondary.

## 4. Tech Stack
| Layer | Technology |
|---|---|
| Web Frontend | Next.js (App Router) + Tailwind CSS |
| Mobile | React Native (Expo) |
| Backend / DB | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Payments | Midtrans |
| Maps | Google Maps API |
| Push Notifications | Firebase Cloud Messaging |
| Image Storage | Supabase Storage |
| Hosting | Vercel (web), EAS (mobile builds) |

## 5. Data Requirements

### 5.1 Entities
- **users**: id, name, email, password_hash, role, avatar_url, created_at
- **merchants**: id, user_id, store_name, description, address, lat, lng, phone, photo_url, is_halal, verified, rating, total_kg_saved, created_at
- **listings**: id, merchant_id, title, description, photo_url, category, is_halal, original_price, discounted_price, weight_kg, quantity, quantity_sold, pickup_start, pickup_end, type (surprise_bag/specific), status, created_at
- **orders**: id, user_id, listing_id, quantity, total_price, total_weight_kg, qr_code, status, created_at, picked_up_at
- **reviews**: id, order_id, user_id, merchant_id, rating, comment, created_at
- **payments**: id, order_id, amount, method, status, midtrans_ref, created_at
- **impact_logs**: id, order_id, food_kg, co2_kg, created_at

## 6. API Endpoints (Key)
| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register user |
| POST | /auth/login | Login |
| GET | /listings | Browse listings (with filters) |
| GET | /listings/:id | Listing detail |
| POST | /listings | Create listing (merchant) |
| POST | /orders | Create order |
| POST | /orders/:id/verify | Scan QR & verify pickup |
| GET | /merchants/:id/analytics | Merchant analytics |
| GET | /impact | Global impact stats |
| GET | /admin/merchants/pending | Pending merchant list |
| POST | /admin/merchants/:id/approve | Approve merchant |

## 7. Reference
- [FoodCycle Indonesia — Food Rescue Warrior](https://foodcycle.id/food-rescue-warrior/#fr)

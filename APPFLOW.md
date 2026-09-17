# App Flow — Food Rescue

## Overview
Food Rescue menghubungkan merchant (restoran/toko/bakery/HOREKA) yang punya makanan surplus dengan konsumen yang ingin membeli dengan harga diskon. Terinspirasi dari model FoodCycle Indonesia — tapi kita buat versi marketplace digital (C2C) yang scalable.

---

## User Roles
- **Consumer** — browse, order, pickup
- **Merchant** — posting makanan surplus, manage order
- **Admin** — verifikasi merchant, monitor platform, manage impact data
- **Volunteer** (future) — bantu distribusi ke komunitas penerima manfaat

---

## Flow: Consumer

```
Launch App
  └── Onboarding (skip jika sudah login)
        └── Register / Login (Email / Google)
              └── Home Screen
                    ├── Impact Counter (kg makanan diselamatkan, CO2 dicegah) [global]
                    ├── Browse Listings (map / list view)
                    │     ├── Filter (jarak, kategori, harga, pickup window)
                    │     └── Listing Detail
                    │           ├── Info merchant, foto, harga asli vs diskon
                    │           ├── Pickup window & lokasi
                    │           ├── Kategori makanan (halal/non-halal label)
                    │           ├── Estimasi berat (kg)
                    │           └── Order
                    │                 └── Pilih kuantitas (min order berlaku)
                    │                       └── Checkout
                    │                             └── Payment (Midtrans/Xendit)
                    │                                   ├── Success → Order Confirmation + QR Code
                    │                                   └── Failed → Retry / Cancel
                    ├── My Orders
                    │     ├── Pending / Paid / Picked Up / Cancelled / Expired
                    │     └── Show QR Code untuk pickup
                    ├── My Impact
                    │     ├── Total makanan yang kamu selamatkan (kg)
                    │     ├── CO2 yang kamu cegah (kg)
                    │     └── Badge / achievement
                    ├── History
                    │     └── Review & Rating (setelah pickup)
                    └── Profile
                          ├── Edit profil
                          ├── Notification settings
                          └── Logout
```

---

## Flow: Merchant

```
Launch App / Web Dashboard
  └── Register / Login
        └── Submit dokumen verifikasi (nama usaha, alamat, foto lokasi)
              └── Verifikasi oleh Admin (pending state)
                    └── Dashboard
                          ├── Post Listing Baru
                          │     ├── Nama, foto, deskripsi
                          │     ├── Kategori makanan + label halal/non-halal
                          │     ├── Harga asli & harga diskon (50-70% off)
                          │     ├── Estimasi berat per bag (kg)
                          │     ├── Kuota (jumlah bag, min 5kg total)
                          │     ├── Pickup window (jam mulai - jam selesai)
                          │     └── Tipe: Surprise Bag / Specific Item
                          ├── Manage Listings
                          │     ├── Active / Sold Out / Expired
                          │     └── Edit / Hapus listing
                          ├── Incoming Orders
                          │     ├── Notifikasi order masuk
                          │     └── Scan QR Code konsumen saat pickup
                          ├── Analytics & Impact
                          │     ├── Total makanan terselamatkan (kg)
                          │     ├── Total CO2 dicegah (kg)
                          │     ├── Revenue tambahan
                          │     ├── Rating toko
                          │     └── Food Waste Warrior badge (jika reach target)
                          └── Profile Toko
                                ├── Edit info toko
                                ├── Jam operasional
                                └── Logout
```

---

## Flow: Admin

```
Web Dashboard
  └── Login
        └── Dashboard
              ├── Merchant Management
              │     ├── List merchant pending → Review dokumen → Approve / Reject
              │     ├── Suspend merchant
              │     └── Food safety compliance check
              ├── Listings Monitor
              │     ├── Flag / takedown listing bermasalah
              │     └── Halal/non-halal verification
              ├── Transactions
              │     └── Monitor semua transaksi, refund jika perlu
              ├── Impact Dashboard
              │     ├── Total kg makanan diselamatkan
              │     ├── Total CO2 reduced (kg)
              │     ├── Total transaksi platform
              │     └── Leaderboard merchant (top rescuers)
              └── Content Management
                    └── Manage food safety guidelines untuk merchant
```

---

## Key States: Order

```
PENDING → PAID → PICKED_UP
                └── (tidak pickup dalam window) → EXPIRED (auto)
PAID → CANCELLED (refund)
```

---

## Impact Calculation Formula
- **CO2 dicegah** = kg makanan diselamatkan × 2.5 (avg CO2 per kg food waste ke TPA)
- **Referensi:** FoodCycle Indonesia menggunakan metrik serupa untuk reporting

---

## Food Safety Rules
- Makanan harus masih layak konsumsi (belum expired)
- Non-halal items harus diberi label jelas
- Merchant wajib packing food-grade (wadah tertutup)
- Pickup window max 4 jam dari waktu posting

---

## Notifications
| Trigger | Target |
|---|---|
| Order masuk | Merchant |
| Payment sukses | Consumer |
| Pickup reminder (30 mnt sebelum window tutup) | Consumer |
| Order expired (tidak di-pickup) | Consumer + Merchant |
| Merchant approved | Merchant |
| Listing hampir habis (sisa 1) | Consumer (yang pernah order di merchant tsb) |
| Weekly impact summary | Consumer + Merchant |
| Food Waste Warrior badge earned | Merchant |

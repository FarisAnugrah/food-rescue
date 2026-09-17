# App Flow — Food Rescue

## Overview
Food Rescue menghubungkan merchant (restoran/toko/bakery) yang punya makanan sisa dengan konsumen yang ingin membeli dengan harga diskon.

---

## User Roles
- **Consumer** — browse, order, pickup
- **Merchant** — posting makanan, manage order
- **Admin** — verifikasi merchant, monitor platform

---

## Flow: Consumer

```
Launch App
  └── Onboarding (skip jika sudah login)
        └── Register / Login
              └── Home Screen
                    ├── Browse Listings (map / list view)
                    │     ├── Filter (jarak, kategori, harga)
                    │     └── Listing Detail
                    │           ├── Info merchant, foto, harga, pickup window
                    │           └── Order
                    │                 └── Pilih kuantitas
                    │                       └── Checkout
                    │                             └── Payment (Midtrans/Xendit)
                    │                                   ├── Success → Order Confirmation + QR Code
                    │                                   └── Failed → Retry / Cancel
                    ├── My Orders
                    │     ├── Pending / Paid / Picked Up / Cancelled
                    │     └── Show QR Code untuk pickup
                    ├── History
                    │     └── Review & Rating (setelah pickup)
                    └── Profile
                          ├── Edit profil
                          └── Logout
```

---

## Flow: Merchant

```
Launch App / Web Dashboard
  └── Register / Login
        └── Verifikasi oleh Admin (pending state)
              └── Dashboard
                    ├── Post Listing Baru
                    │     ├── Nama, foto, deskripsi
                    │     ├── Harga asli & harga diskon
                    │     ├── Kuota (jumlah bag)
                    │     └── Pickup window (jam mulai - jam selesai)
                    ├── Manage Listings
                    │     ├── Active / Sold Out / Expired
                    │     └── Edit / Hapus listing
                    ├── Incoming Orders
                    │     ├── Notifikasi order masuk
                    │     └── Scan QR Code konsumen saat pickup
                    ├── Analytics
                    │     ├── Total makanan terselamatkan (kg)
                    │     ├── Revenue tambahan
                    │     └── Rating toko
                    └── Profile Toko
                          ├── Edit info toko
                          └── Logout
```

---

## Flow: Admin

```
Web Dashboard
  └── Login
        └── Dashboard
              ├── Merchant Management
              │     ├── List merchant pending → Approve / Reject
              │     └── Suspend merchant
              ├── Listings Monitor
              │     └── Flag / takedown listing bermasalah
              ├── Transactions
              │     └── Monitor semua transaksi, refund jika perlu
              └── Impact Dashboard
                    ├── Total kg makanan diselamatkan
                    ├── Total CO2 reduced
                    └── Total transaksi platform
```

---

## Key States: Order

```
PENDING → PAID → PICKED_UP
                └── (tidak pickup) → EXPIRED (auto after pickup window)
PAID → CANCELLED (refund)
```

---

## Notifications
| Trigger | Target |
|---|---|
| Order masuk | Merchant |
| Payment sukses | Consumer |
| Pickup reminder (30 mnt sebelum window tutup) | Consumer |
| Merchant approved | Merchant |
| Listing hampir habis (sisa 1) | - |

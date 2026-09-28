# API Reference

Aplikasi ini tidak memiliki REST API publik yang konvensional. Semua interaksi database dan autentikasi dilakukan menggunakan **Supabase Client (SDK)** yang memanfaatkan sistem Row Level Security (RLS) PostgreSQL dan GraphQL-like syntax dari PostgREST.

## Webhooks

Satu-satunya endpoint eksternal yang tersedia adalah Webhook untuk Xendit Payment Gateway.

### `POST /api/webhooks/xendit`
Menerima payload callback dari Xendit ketika status invoice/QRIS berubah.
- **Headers:** `x-callback-token` harus sama dengan `XENDIT_WEBHOOK_TOKEN`
- **Body:** JSON Xendit standard payload (status `PAID`, `EXPIRED`, `FAILED`)
- **Action:** Memperbarui status pesanan di database dan menjalankan fungsi SQL terkait pengembalian stok (jika kadaluarsa).

## Cron Jobs

### `GET /api/cron/expire-orders`
Dipanggil secara otomatis setiap 10 menit oleh Vercel Cron.
- **Headers:** `Authorization: Bearer <CRON_SECRET>`
- **Action:** Menjalankan fungsi RPC `auto_expire_orders()` untuk membatalkan pesanan yang telat di-pickup dan menutup *listing* merchant yang telah melewati jam tayang.

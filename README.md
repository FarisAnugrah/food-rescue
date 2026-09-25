# Food Rescue Indonesia 🍃

Marketplace platform yang menghubungkan merchant HOREKA (Hotel, Restoran, Katering) dan retail yang memiliki surplus makanan dengan konsumen untuk mengurangi *food waste* di Indonesia.

## Fitur Utama
- **Surprise Bag & Specific Items:** Beli makanan surplus dengan diskon 50-70%.
- **Impact Tracking:** Setiap pesanan melacak metrik makanan yang diselamatkan (kg) dan emisi CO2 yang berhasil dicegah.
- **Role-based Dashboards:** Admin, Merchant, dan Consumer memiliki dashboard khusus.
- **In-App Payments:** Terintegrasi dengan Xendit untuk pembayaran OVO, GoPay, QRIS, dan VA BCA.
- **Realtime Updates:** Sinkronisasi stok otomatis menggunakan Supabase Realtime.

## Tech Stack
- Next.js 15 (App Router)
- React Native (Expo)
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage, Realtime)
- Xendit Payment Gateway
- Leaflet (Maps)

## Mulai Menjalankan
\`\`\`bash
pnpm install
pnpm dev
\`\`\`
Pastikan file \`.env\` sudah diisi sesuai \`.env.example\`.

import Link from "next/link";

const STATS = [
  { value: "700+", label: "Ton makanan terbuang/hari" },
  { value: "22 Jt", label: "Orang kelaparan di Indonesia" },
  { value: "140K", label: "m³ gas metana/hari" },
];

const FEATURES = [
  {
    icon: "🍱",
    title: "Surprise Bag",
    desc: "Dapatkan makanan berkualitas dari restoran & bakery favoritmu dengan harga 50-70% lebih murah.",
  },
  {
    icon: "📍",
    title: "Nearby Pickup",
    desc: "Temukan merchant terdekat di peta, pesan, dan ambil langsung di lokasi sesuai jadwal.",
  },
  {
    icon: "🌱",
    title: "Track Impact",
    desc: "Lihat berapa kg makanan yang kamu selamatkan dan CO2 yang berhasil dicegah.",
  },
];

const STEPS = [
  { step: "1", title: "Cari", desc: "Browse makanan surplus di sekitarmu" },
  { step: "2", title: "Pesan", desc: "Bayar dengan harga diskon besar" },
  { step: "3", title: "Ambil", desc: "Pickup di merchant sesuai waktu yang ditentukan" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur">
        <span className="text-xl font-bold text-primary">Food Rescue</span>
        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Masuk
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Daftar
          </Link>
        </div>
      </nav>

      <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Selamatkan Makanan,
          <br />
          <span className="text-primary">Hemat Uangmu</span>
        </h1>
        <p className="max-w-lg text-lg text-gray-500">
          Beli makanan surplus dari restoran & toko di sekitarmu dengan diskon hingga 70%.
          Kurangi food waste, bantu lingkungan.
        </p>
        <div className="flex gap-3">
          <Link
            href="/auth/register"
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark"
          >
            Mulai Sekarang
          </Link>
          <a
            href="#cara-kerja"
            className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
          >
            Cara Kerja
          </a>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Kenapa Food Rescue?
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border p-6">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cara-kerja" className="bg-gray-50 px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Cara Kerja</h2>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {s.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-2xl bg-primary p-12 text-center text-white">
          <h2 className="text-3xl font-bold">Bergabung Sekarang</h2>
          <p className="mt-3 text-primary-dark/70 text-green-100">
            Jadilah bagian dari gerakan menyelamatkan makanan di Indonesia.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/auth/register"
              className="rounded-lg bg-white px-6 py-3 font-medium text-primary hover:bg-gray-100"
            >
              Daftar sebagai Consumer
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg border border-white px-6 py-3 font-medium text-white hover:bg-primary-dark"
            >
              Daftar sebagai Merchant
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Food Rescue. Selamatkan makanan, kurangi limbah.
      </footer>
    </div>
  );
}

import Link from "next/link";
import { ScrollToTop } from "@/components/scroll-to-top";
import { createClient } from "@/lib/supabase/server";
import { getLandingPageData } from "@/lib/cms-queries";

const FEATURES = [
  {
    label: "01",
    title: "Surprise Bag",
    desc: "Makanan berkualitas dari restoran & bakery dengan harga 50–70% lebih murah. Tiap bag berbeda — selalu ada kejutan.",
  },
  {
    label: "02",
    title: "Pickup Fleksibel",
    desc: "Pesan lewat app, ambil langsung di merchant sesuai pickup window yang ditentukan. Cepat, no queue.",
  },
  {
    label: "03",
    title: "Lacak Dampakmu",
    desc: "Setiap order yang kamu beli otomatis tercatat — berapa kg makanan yang diselamatkan dan CO₂ yang dicegah.",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { stats, testimonials: TESTIMONIALS } = await getLandingPageData();

  const dynamicStats = [
    { value: stats?.merchants || "0", label: "Merchant Aktif", suffix: "+" },
    { value: stats?.kg_saved ? (stats.kg_saved / 1000).toFixed(1) : "0", label: "Ton Makanan Diselamatkan", suffix: "" },
    { value: "70", label: "Diskon hingga", suffix: "%" },
  ];

  let role = "guest";
  if (user) {
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    role = profile?.role || "consumer";
  }

  const userInitial = user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";
  
  // Dynamic variables based on role
  const dashboardLink = role === "merchant" ? "/merchant" : role === "admin" ? "/admin" : "/listings";
  const dashboardLabel = role === "merchant" ? "Toko Saya" : role === "admin" ? "Admin" : "Mulai Belanja";

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf7]">
      <ScrollToTop />

      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-[#1b4332]">
            food<span className="text-[#2d6a4f]">rescue</span>
          </span>
          <div className="hidden gap-8 text-sm font-medium text-[#4a4a4a] sm:flex">
            <a href="#cara-kerja" className="hover:text-[#2d6a4f] transition-colors">Cara Kerja</a>
            <a href="#dampak" className="hover:text-[#2d6a4f] transition-colors">Dampak</a>
            <a href="#merchant" className="hover:text-[#2d6a4f] transition-colors">Untuk Merchant</a>
          </div>
          <div className="flex gap-2">
            {user ? (
              <Link
                href={dashboardLink}
                className="flex items-center gap-2 rounded-full border border-[#e8e4d4] pl-2 pr-4 py-1.5 text-sm font-medium text-[#1b4332] hover:bg-[#d8f3dc] transition-colors bg-white"
              >
                <div className="w-6 h-6 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-xs font-bold">
                  {userInitial}
                </div>
                {dashboardLabel}
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#1b4332] hover:bg-[#d8f3dc] transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-full bg-[#2d6a4f] px-5 py-2 text-sm font-medium text-white hover:bg-[#1b4332] transition-colors"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 sm:grid-cols-2 sm:items-center sm:py-32">
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-full bg-[#d8f3dc] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#2d6a4f]">
            Gerakan Food Rescue Indonesia
          </span>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-[#1b4332] sm:text-6xl">
            Makanan Lebih.
            <br />
            <span className="text-[#52b788]">Bukan Sampah.</span>
          </h1>
        <p className="max-w-md text-lg text-[#555] leading-relaxed">
          Beli makanan surplus dari restoran & toko di sekitarmu dengan diskon hingga 70%.
          Kurangi food waste, bantu lingkungan, hemat uang.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {user ? (
             <Link
               href={dashboardLink}
               className="rounded-full bg-[#2d6a4f] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#1b4332] transition-colors"
             >
               {role === "merchant" ? "Buka Dashboard Toko" : role === "admin" ? "Buka Panel Admin" : "Lanjutkan Belanja"}
             </Link>
          ) : (
            <Link
              href="/auth/register"
              className="rounded-full bg-[#2d6a4f] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#1b4332] transition-colors"
            >
              Mulai Selamatkan Makanan
            </Link>
          )}
          <a
              href="#cara-kerja"
              className="rounded-full border border-[#c8c4b4] px-7 py-3.5 text-sm font-semibold text-[#1b4332] hover:bg-[#f0ede0] transition-colors"
            >
              Lihat Cara Kerja
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl bg-[#d8f3dc] aspect-square sm:aspect-[4/5] flex items-center justify-center relative">
          <img 
            src="/images/hero.webp" 
            alt="Food Rescue Hero" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
        </div>
      </section>

      {/* Stats */}
      <section id="dampak" className="bg-[#1b4332] py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0 px-6 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2d6a4f]">
          {dynamicStats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-10 sm:py-6 text-center">
              <p className="text-5xl font-bold text-white">
                {s.value}
                <span className="text-[#52b788]">{s.suffix}</span>
              </p>
              <p className="mt-2 text-sm text-[#95d5b2]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="cara-kerja" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#52b788]">
            Fitur Utama
          </span>
          <h2 className="text-4xl font-bold text-[#1b4332] sm:text-5xl">
            Semua dalam satu app.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="group rounded-2xl border border-[#e8e4d4] bg-white p-8 hover:border-[#2d6a4f] hover:shadow-lg transition-all"
            >
              <span className="text-xs font-bold text-[#c8c4b4]">{f.label}</span>
              <h3 className="mt-4 text-xl font-bold text-[#1b4332]">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#666]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#fefae0] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#52b788]">
              Cara Kerja
            </span>
            <h2 className="text-4xl font-bold text-[#1b4332] sm:text-5xl">
              3 langkah, selesai.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { n: "1", t: "Cari di Sekitarmu", d: "Buka app, lihat daftar merchant & surprise bag yang tersedia di dekatmu hari ini." },
              { n: "2", t: "Pesan & Bayar", d: "Pilih bag, bayar via e-wallet atau QRIS. Harga sudah diskon besar — langsung konfirmasi." },
              { n: "3", t: "Pickup & Nikmati", d: "Tunjukkan QR code ke merchant, ambil makananmu dalam pickup window yang ditentukan." },
            ].map((s) => (
              <div key={s.n} className="flex gap-5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2d6a4f] text-sm font-bold text-white">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-bold text-[#1b4332]">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#666]">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#52b788]">
            Kata Mereka
          </span>
          <h2 className="text-4xl font-bold text-[#1b4332] sm:text-5xl">
            Sudah dirasakan manfaatnya.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-[#f4f1de] p-8 flex flex-col gap-6"
            >
              <p className="text-lg leading-relaxed text-[#333]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-[#1b4332]">{t.name}</p>
                <p className="text-sm text-[#888]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Merchant CTA */}
      <section id="merchant" className="bg-[#1b4332] py-24">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-lg">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#52b788]">
              Untuk Merchant
            </span>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Surplus makananmu = revenue tambahan.
            </h2>
            <p className="text-[#95d5b2] leading-relaxed">
              Daftarkan tokomu, posting surplus bag dalam hitungan menit.
              Merchant kami rata-rata mendapat revenue tambahan 15–30% dari makanan yang sebelumnya terbuang.
            </p>
            <Link
              href="/auth/register"
              className="w-fit rounded-full bg-[#52b788] px-7 py-3.5 text-sm font-semibold text-[#1b4332] hover:bg-[#74c69d] transition-colors"
            >
              Daftar sebagai Merchant
            </Link>
          </div>
          <div className="w-full sm:w-80 h-56 rounded-2xl bg-[#2d6a4f] flex items-center justify-center relative overflow-hidden">
            <img 
              src="/images/merchant-cta.webp" 
              alt="Merchant Storefront" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" 
            />
            <span className="text-white text-sm font-bold opacity-0 hover:opacity-100 transition-opacity z-10">Food Rescue Merchant</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold text-[#1b4332] sm:text-5xl">
          Siap menyelamatkan makanan pertamamu?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[#666]">
          Gratis. Tidak perlu kartu kredit. Langsung bisa order dalam 5 menit.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link
            href="/auth/register"
            className="rounded-full bg-[#2d6a4f] px-8 py-4 font-semibold text-white hover:bg-[#1b4332] transition-colors"
          >
            Buat Akun Gratis
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-[#c8c4b4] px-8 py-4 font-semibold text-[#1b4332] hover:bg-[#f0ede0] transition-colors"
          >
            Sudah punya akun
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8e4d4] bg-[#fafaf7]">
        <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col sm:flex-row justify-between gap-8 text-sm text-[#888]">
          <div>
            <span className="text-base font-bold text-[#1b4332]">
              food<span className="text-[#2d6a4f]">rescue</span>
            </span>
            <p className="mt-2 max-w-xs leading-relaxed">
              Platform marketplace food rescue Indonesia. Selamatkan makanan, kurangi limbah.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-[#1b4332]">Platform</span>
              <a href="#cara-kerja" className="hover:text-[#2d6a4f]">Cara Kerja</a>
              <Link href="/auth/register" className="hover:text-[#2d6a4f]">Daftar Consumer</Link>
              <Link href="/auth/register" className="hover:text-[#2d6a4f]">Daftar Merchant</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-[#1b4332]">Dampak</span>
              <a href="#dampak" className="hover:text-[#2d6a4f]">Statistik</a>
              <a href="#merchant" className="hover:text-[#2d6a4f]">Untuk Merchant</a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#e8e4d4] py-4 text-center text-xs text-[#aaa]">
          &copy; {new Date().getFullYear()} Food Rescue Indonesia
        </div>
      </footer>
    </div>
  );
}

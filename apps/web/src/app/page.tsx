import Link from "next/link";
import { ScrollToTop } from "@/components/scroll-to-top";
import { createClient } from "@/lib/supabase/server";

const STATS = [
  { value: "185", label: "Merchant Aktif", suffix: "+" },
  { value: "1.752", label: "Ton Makanan Diselamatkan", suffix: "" },
  { value: "70", label: "Diskon hingga", suffix: "%" },
];

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

const TESTIMONIALS = [
  {
    quote:
      "Awalnya skeptis, tapi ternyata makanannya masih layak banget. Sekarang tiap sore saya cek app-nya sebelum pulang kerja.",
    name: "Rendra A.",
    role: "Consumer, Jakarta Selatan",
  },
  {
    quote:
      "Dulu makanan sisa tiap malam dibuang. Sekarang malah jadi revenue tambahan. Tim onboarding-nya juga helpful banget.",
    name: "Dewi S.",
    role: "Owner Bakery, Bandung",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="flex flex-col min-h-screen bg-gray-50 selection:bg-[#2d6a4f] selection:text-white">
      <ScrollToTop />

      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-black tracking-tight text-gray-900">
            Food<span className="text-[#2d6a4f]">Rescue</span>
          </span>
          <div className="hidden gap-8 text-sm font-semibold text-gray-500 sm:flex">
            <a href="#cara-kerja" className="hover:text-gray-900 transition-colors">Cara Kerja</a>
            <a href="#dampak" className="hover:text-gray-900 transition-colors">Dampak</a>
            <a href="#merchant" className="hover:text-gray-900 transition-colors">Untuk Merchant</a>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Link
                href={dashboardLink}
                className="flex items-center gap-2.5 rounded-full border border-gray-200 pl-2 pr-4 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all bg-white shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                  {userInitial}
                </div>
                {dashboardLabel}
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-md"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 sm:grid-cols-2 sm:items-center sm:py-32">
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-full bg-green-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#2d6a4f] ring-1 ring-inset ring-green-600/20">
            Gerakan Food Rescue Indonesia
          </span>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tighter text-gray-900 sm:text-7xl">
            Makanan Lebih.
            <br />
            <span className="text-[#2d6a4f]">Bukan Sampah.</span>
          </h1>
        <p className="max-w-md text-lg text-gray-500 leading-relaxed font-medium">
          Beli makanan surplus dari restoran & toko di sekitarmu dengan diskon hingga 70%.
          Kurangi food waste, bantu lingkungan, hemat uang.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          {user ? (
             <Link
               href={dashboardLink}
               className="rounded-full bg-black px-8 py-4 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
             >
               {role === "merchant" ? "Buka Dashboard Toko" : role === "admin" ? "Buka Panel Admin" : "Lanjutkan Belanja"}
             </Link>
          ) : (
            <Link
              href="/auth/register"
              className="rounded-full bg-black px-8 py-4 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Mulai Selamatkan Makanan
            </Link>
          )}
          <a
              href="#cara-kerja"
              className="rounded-full border border-gray-200 bg-white px-8 py-4 text-sm font-bold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
            >
              Lihat Cara Kerja
            </a>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-gray-100 aspect-square sm:aspect-[4/5] flex items-center justify-center shadow-2xl ring-1 ring-black/5 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#2d6a4f]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <span className="text-gray-400 text-sm font-bold tracking-widest uppercase">
            Hero Image
          </span>
        </div>
      </section>

      {/* Stats */}
      <section id="dampak" className="bg-[#1b4332] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-6 sm:py-2 text-center">
              <p className="text-5xl font-black text-white tracking-tight">
                {s.value}
                <span className="text-[#52b788]">{s.suffix}</span>
              </p>
              <p className="mt-3 text-sm font-medium uppercase tracking-widest text-[#95d5b2]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="cara-kerja" className="mx-auto max-w-6xl px-6 py-32">
        <div className="mb-20 flex flex-col gap-3 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Fitur Utama
          </span>
          <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Semua dalam satu app.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="group rounded-3xl bg-white p-10 shadow-sm ring-1 ring-black/5 hover:-translate-y-1 hover:shadow-xl hover:ring-black/10 transition-all duration-300"
            >
              <span className="text-sm font-black text-gray-300">{f.label}</span>
              <h3 className="mt-6 text-xl font-bold text-gray-900">{f.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-500 font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-100 py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-20 flex flex-col gap-3 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Cara Kerja
            </span>
            <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
              3 langkah, selesai.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {[
              { n: "1", t: "Cari di Sekitarmu", d: "Buka app, lihat daftar merchant & surprise bag yang tersedia di dekatmu hari ini." },
              { n: "2", t: "Pesan & Bayar", d: "Pilih bag, bayar via e-wallet atau QRIS. Harga sudah diskon besar — langsung konfirmasi." },
              { n: "3", t: "Pickup & Nikmati", d: "Tunjukkan QR code ke merchant, ambil makananmu dalam pickup window yang ditentukan." },
            ].map((s) => (
              <div key={s.n} className="flex gap-6">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-black text-white shadow-md">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500 font-medium">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <div className="mb-20 flex flex-col gap-3 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Kata Mereka
          </span>
          <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Sudah dirasakan manfaatnya.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl bg-gray-50 p-10 flex flex-col gap-8 ring-1 ring-black/5"
            >
              <p className="text-lg leading-relaxed text-gray-700 font-medium">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-bold text-gray-900">{t.name}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Merchant CTA */}
      <section id="merchant" className="bg-[#1b4332] py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2d6a4f] rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="relative mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-16">
          <div className="flex flex-col gap-6 max-w-xl text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#95d5b2]">
              Untuk Merchant
            </span>
            <h2 className="text-4xl font-black text-white leading-[1.1] tracking-tight sm:text-5xl">
              Surplus makananmu = revenue tambahan.
            </h2>
            <p className="text-[#95d5b2] leading-relaxed font-medium text-lg">
              Daftarkan tokomu, posting surplus bag dalam hitungan menit.
              Merchant kami rata-rata mendapat revenue tambahan 15–30% dari makanan yang sebelumnya terbuang.
            </p>
            <div className="pt-4 flex justify-center sm:justify-start">
              <Link
                href="/auth/register"
                className="w-fit rounded-full bg-white px-8 py-4 text-sm font-bold text-[#1b4332] hover:bg-gray-100 transition-colors shadow-lg"
              >
                Daftar sebagai Merchant
              </Link>
            </div>
          </div>
          <div className="w-full sm:w-96 h-80 rounded-3xl bg-black/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/10 shadow-2xl">
            <span className="text-white/40 text-sm font-bold tracking-widest uppercase">Foto Merchant</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-32 text-center">
        <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-6xl max-w-3xl mx-auto">
          Siap menyelamatkan makanan pertamamu?
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-gray-500 font-medium text-lg">
          Gratis. Tidak perlu kartu kredit. Langsung bisa order dalam 5 menit.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link
            href="/auth/register"
            className="rounded-full bg-black px-10 py-4 font-bold text-white hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Buat Akun Gratis
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-gray-200 bg-white px-10 py-4 font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            Sudah punya akun
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col sm:flex-row justify-between gap-12 text-sm text-gray-500 font-medium">
          <div>
            <span className="text-lg font-black tracking-tight text-gray-900">
              Food<span className="text-[#2d6a4f]">Rescue</span>
            </span>
            <p className="mt-4 max-w-xs leading-relaxed">
              Platform marketplace food rescue Indonesia. Selamatkan makanan, kurangi limbah.
            </p>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">Platform</span>
              <a href="#cara-kerja" className="hover:text-gray-900 transition-colors">Cara Kerja</a>
              <Link href="/auth/register" className="hover:text-gray-900 transition-colors">Daftar Consumer</Link>
              <Link href="/auth/register" className="hover:text-gray-900 transition-colors">Daftar Merchant</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">Dampak</span>
              <a href="#dampak" className="hover:text-gray-900 transition-colors">Statistik</a>
              <a href="#merchant" className="hover:text-gray-900 transition-colors">Untuk Merchant</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400 font-medium">
          &copy; {new Date().getFullYear()} Food Rescue Indonesia
        </div>
      </footer>
    </div>
  );
}

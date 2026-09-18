import Link from "next/link";
import { logout } from "@/lib/auth-actions";

const NAV_ITEMS = [
  { href: "/merchant", label: "Overview" },
  { href: "/merchant/listings", label: "Listings" },
  { href: "/merchant/orders", label: "Orders" },
  { href: "/merchant/analytics", label: "Analytics" },
];

export default function MerchantNav({ active }: { active: string }) {
  return (
    <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#1b4332]">
          food<span className="text-[#2d6a4f]">rescue</span>
          <span className="ml-2 text-xs font-normal text-[#52b788]">merchant</span>
        </Link>
        <div className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === item.href
                  ? "bg-[#2d6a4f] text-white"
                  : "text-[#555] hover:bg-[#d8f3dc]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <form action={logout}>
            <button type="submit" className="ml-2 rounded-full border border-[#e8e4d4] px-4 py-2 text-sm font-medium text-[#555] hover:bg-[#f0ede0] transition-colors">
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

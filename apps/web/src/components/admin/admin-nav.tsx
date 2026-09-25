import Link from "next/link";
import { logout } from "@/lib/auth-actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/merchants", label: "Merchants" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/impact", label: "Impact" },
  { href: "/admin/cms", label: "CMS" },
];

export default function AdminNav({ active }: { active: string }) {
  return (
    <nav className="sticky top-0 z-20 bg-[#1b4332]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          food<span className="text-[#52b788]">rescue</span>
          <span className="ml-2 text-xs font-normal text-[#95d5b2]">admin</span>
        </Link>
        <div className="flex gap-1 items-center">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === item.href
                  ? "bg-[#52b788] text-[#1b4332]"
                  : "text-[#95d5b2] hover:bg-[#2d6a4f]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <form action={logout} className="ml-2 pl-3 border-l border-[#2d6a4f]">
            <button type="submit" className="text-xs font-bold text-[#95d5b2] hover:text-white transition-colors">
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";
import { logout } from "@/lib/auth-actions";
import { Menu } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/merchants", label: "Merchants" },
  { href: "/admin/wallet", label: "Payouts" },
  { href: "/admin/impact", label: "Impact" },
  { href: "/admin/cms", label: "CMS" },
];

export default function AdminNav({ active }: { active: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-20 bg-[#1b4332]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white shrink-0">
          food<span className="text-[#52b788]">rescue</span>
          <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs font-normal text-[#95d5b2]">admin</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-1 items-center">
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

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white bg-[#2d6a4f] rounded-full lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#1b4332] border-t border-[#2d6a4f] p-4 shadow-lg flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                active === item.href
                  ? "bg-[#52b788] text-[#1b4332]"
                  : "text-[#95d5b2] hover:bg-[#2d6a4f]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <form action={logout} className="mt-2 pt-2 border-t border-[#2d6a4f]">
            <button type="submit" className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-[#95d5b2] hover:bg-[#2d6a4f]">
              Logout
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}

import Link from "next/link";
import { logout } from "@/lib/auth-actions";
import NotificationBell from "@/components/notification-bell";
import { Menu } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/merchant", label: "Overview" },
  { href: "/merchant/listings", label: "Listings" },
  { href: "/merchant/orders", label: "Orders" },
  { href: "/merchant/analytics", label: "Analytics" },
  { href: "/merchant/wallet", label: "Wallet" },
  { href: "/merchant/profile", label: "Profile" },
];

export default function MerchantNav({ active }: { active: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-20 bg-[#fafaf7]/90 backdrop-blur border-b border-[#e8e4d4]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#1b4332] shrink-0">
          food<span className="text-[#2d6a4f]">rescue</span>
          <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs font-normal text-[#52b788]">merchant</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-1 items-center">
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
          <div className="ml-2 flex items-center gap-2 border-l border-[#e8e4d4] pl-3">
            <NotificationBell />
            <form action={logout}>
              <button type="submit" className="text-xs font-medium text-[#888] hover:text-[#e63946] transition-colors px-2">
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <NotificationBell />
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#1b4332] bg-[#f0ede0] rounded-full">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-[#e8e4d4] p-4 shadow-lg flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                active === item.href
                  ? "bg-[#d8f3dc] text-[#1b4332]"
                  : "text-[#555] hover:bg-[#f0ede0]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <form action={logout} className="mt-2 pt-2 border-t border-[#e8e4d4]">
            <button type="submit" className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50">
              Logout
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}

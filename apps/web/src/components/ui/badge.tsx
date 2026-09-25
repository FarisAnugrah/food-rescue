import { ReactNode } from "react";

export function Badge({ children, type = "default" }: { children: ReactNode, type?: "default" | "success" | "warning" | "error" }) {
  const styles = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-[#d8f3dc] text-[#2d6a4f]",
    warning: "bg-orange-50 text-orange-700",
    error: "bg-red-50 text-red-600"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${styles[type]}`}>
      {children}
    </span>
  );
}

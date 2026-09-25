import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 ${className}`}>
      {children}
    </div>
  );
}

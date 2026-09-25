import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline";
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles = "rounded-full px-6 py-3 text-sm font-bold transition-all disabled:opacity-50 shadow-sm";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-[#2d6a4f] text-white hover:bg-[#1b4332]",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    outline: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

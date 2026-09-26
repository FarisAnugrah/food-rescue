import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-black outline-none transition-colors bg-white ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

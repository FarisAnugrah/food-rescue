import { ReactNode } from "react";

export function Tooltip({ children, text }: { children: ReactNode; text: string }) {
  return (
    <div className="group relative inline-block">
      {children}
      <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-bold text-white bg-gray-900 rounded whitespace-nowrap z-50">
        {text}
        <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
      </span>
    </div>
  );
}

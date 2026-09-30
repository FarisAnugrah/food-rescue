export function PromoBanner({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="w-full bg-[#fefae0] text-[#92400e] px-4 py-2 text-center text-xs font-bold uppercase tracking-wider">
      {text}
    </div>
  );
}

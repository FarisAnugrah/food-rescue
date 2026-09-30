export function Toast({ message, type = "success" }: { message: string, type?: "success" | "error" }) {
  if (!message) return null;
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-full shadow-lg z-50 text-sm font-bold text-white transition-all transform animate-in slide-in-from-bottom-5 ${type === "error" ? "bg-red-600" : "bg-[#1b4332]"}`}>
      {message}
    </div>
  );
}

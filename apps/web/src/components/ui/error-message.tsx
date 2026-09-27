import { AlertCircle } from "lucide-react";

export function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 bg-red-50 p-4 rounded-xl text-red-600 border border-red-100">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="text-sm font-medium leading-relaxed">{message}</p>
    </div>
  );
}

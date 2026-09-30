"use client";

export function ConfirmModal({ isOpen, title, desc, onConfirm, onCancel }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
        <p className="text-gray-500 text-sm mt-2">{desc}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-full text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-full text-sm font-bold bg-red-600 text-white hover:bg-red-700">Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  );
}

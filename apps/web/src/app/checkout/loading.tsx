export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#fafaf7] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Menyiapkan halaman checkout...</p>
    </div>
  );
}

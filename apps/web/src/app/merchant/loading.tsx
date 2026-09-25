export default function MerchantLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-10 flex flex-col gap-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="h-4 w-64 bg-gray-200 rounded-lg mb-8"></div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl shadow-sm border border-gray-100"></div>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="h-64 bg-white rounded-2xl shadow-sm border border-gray-100"></div>
        <div className="h-64 bg-white rounded-2xl shadow-sm border border-gray-100"></div>
      </div>
    </div>
  );
}

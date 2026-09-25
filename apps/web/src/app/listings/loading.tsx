export default function ListingsLoading() {
  return (
    <div className="min-h-screen bg-[#fafaf7] px-6 py-10 animate-pulse">
      <div className="h-10 w-64 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-6 w-96 bg-gray-200 rounded-lg mb-8"></div>
      <div className="flex gap-4 mb-8">
        {[1,2,3].map(i => <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>)}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-white rounded-3xl shadow-sm border border-gray-100"></div>)}
      </div>
    </div>
  );
}

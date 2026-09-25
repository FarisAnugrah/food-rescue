export default function AdminImpactLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-10 animate-pulse">
      <div className="h-10 w-64 bg-gray-200 rounded-lg mb-8"></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
}

export default function ListingDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-2xl"></div>
        <div className="flex flex-col gap-4 pt-4">
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-10 w-3/4 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
          <div className="h-32 w-full bg-gray-200 rounded-xl mt-4"></div>
          <div className="h-14 w-full bg-gray-200 rounded-full mt-auto"></div>
        </div>
      </div>
    </div>
  );
}

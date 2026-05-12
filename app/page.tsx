import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Welcome to Snapslot</h1>
      <p className="mb-8 text-gray-600">Venue management simplified</p>
      
      <div className="flex gap-4">
        <Link 
          href="/admin/venues" 
          className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          Admin Dashboard
        </Link>
        <Link 
          href="/venues" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Book a Venue
        </Link>
      </div>
    </main>
  );
}

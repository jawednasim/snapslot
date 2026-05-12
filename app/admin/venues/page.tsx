import { AdminVenues } from "@/components/AdminVenues"

export default function AdminVenuesPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Venue Approvals</h1>
        <AdminVenues />
      </div>
    </div>
  )
}

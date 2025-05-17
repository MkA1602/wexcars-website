import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UserNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">User Not Found</h2>
        <p className="text-yellow-700 mb-4">The user you are looking for does not exist or has been deleted.</p>
        <Button asChild>
          <Link href="/admin/users">Back to Users</Link>
        </Button>
      </div>
    </div>
  )
}

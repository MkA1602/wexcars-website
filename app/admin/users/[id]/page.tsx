import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "User Details | AutoWex Admin",
  description: "View user details",
}

async function getUser(supabase, id) {
  try {
    const { data: user, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Exception fetching user:", error)
    return null
  }
}

export default async function UserDetailPage({ params }) {
  const supabase = createServerComponentClient({ cookies })
  const user = await getUser(supabase, params.id)

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Details</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/users/${user.id}/edit`}>Edit User</Link>
          </Button>
          <Button asChild variant="default">
            <Link href="/admin/users">Back to Users</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.full_name || "Unnamed User"}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">User Information</h3>
              <dl className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium">ID:</dt>
                  <dd className="text-muted-foreground">{user.id}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium">Role:</dt>
                  <dd className="text-muted-foreground">{user.role || "User"}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium">Status:</dt>
                  <dd>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        user.is_active
                          ? "border-green-200 bg-green-50 text-green-800"
                          : "border-red-200 bg-red-50 text-red-800"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium">Joined:</dt>
                  <dd className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium">Last Updated:</dt>
                  <dd className="text-muted-foreground">{new Date(user.updated_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Contact Information</h3>
              <dl className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium">Email:</dt>
                  <dd className="text-muted-foreground">{user.email}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium">Phone:</dt>
                  <dd className="text-muted-foreground">{user.phone || "Not provided"}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium">Address:</dt>
                  <dd className="text-muted-foreground">{user.address || "Not provided"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata = {
  title: "Users | AutoWex Admin",
  description: "Manage your users",
}

async function getUsers(supabase) {
  try {
    const { data: users, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    return users || []
  } catch (error) {
    console.error("Exception fetching users:", error)
    return []
  }
}

export default async function UsersPage() {
  const supabase = createServerComponentClient({ cookies })
  const users = await getUsers(supabase)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button asChild variant="outline">
          <Link href="/admin/users/new">Add New User</Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="font-medium">Search</h2>
        </div>
        <div className="p-4 flex gap-4">
          <Input placeholder="Search by name or email..." className="flex-1" />
          <Button>Search</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="rounded-md border">
          <div className="grid grid-cols-5 p-4 font-medium border-b">
            <div className="col-span-2">User</div>
            <div>Role</div>
            <div>Joined</div>
            <div className="text-right">Actions</div>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No users found. Create a new user to get started.</p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="grid grid-cols-5 p-4 border-b items-center">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="font-medium">{user.full_name || "Unnamed User"}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    {user.role || "User"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</div>
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/users/${user.id}`}>View</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

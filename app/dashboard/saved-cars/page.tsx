import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import DashboardLayout from "@/components/dashboard-layout"
import SavedCarsContent from "@/components/saved-cars-content"

export const metadata: Metadata = {
  title: "Saved Cars | AutoWex",
  description: "View and manage your saved vehicles.",
}

export default async function SavedCarsPage() {
  // In a real app, we would check if the user is authenticated
  // and redirect to the login page if not
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/signin?redirect=/dashboard/saved-cars")
  }

  return (
    <DashboardLayout>
      <SavedCarsContent />
    </DashboardLayout>
  )
}

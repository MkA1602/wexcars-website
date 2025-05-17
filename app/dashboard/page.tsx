import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import DashboardLayout from "@/components/dashboard-layout"
import DashboardOverview from "@/components/dashboard-overview"

export const metadata: Metadata = {
  title: "Dashboard | AutoWex",
  description: "Manage your account, saved vehicles, and more.",
}

export default async function DashboardPage() {
  // In a real app, we would check if the user is authenticated
  // and redirect to the login page if not
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/signin?redirect=/dashboard")
  }

  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}

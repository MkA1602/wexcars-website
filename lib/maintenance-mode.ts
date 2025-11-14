import { supabaseClient } from "@/lib/supabase/client"

export interface MaintenanceModeSettings {
  enabled: boolean
  message?: string
}

/**
 * Check if maintenance mode is enabled
 * Returns null if there's an error (fail open - allow access)
 */
export async function getMaintenanceMode(): Promise<MaintenanceModeSettings | null> {
  try {
    const { data, error } = await supabaseClient
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "maintenance_mode")
      .single()

    if (error) {
      console.error("Error fetching maintenance mode:", error)
      return null // Fail open - allow access if we can't check
    }

    if (!data || !data.setting_value) {
      return { enabled: false }
    }

    const settings = data.setting_value as MaintenanceModeSettings
    return settings
  } catch (error) {
    console.error("Error in getMaintenanceMode:", error)
    return null // Fail open
  }
}

/**
 * Check if the current request is from localhost
 */
export function isLocalhost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("localhost:") ||
    hostname.startsWith("127.0.0.1:") ||
    hostname === "0.0.0.0"
  )
}

/**
 * Check if the current request is from the production domain
 */
export function isProductionDomain(hostname: string): boolean {
  return hostname === "wexcars.com" || hostname === "www.wexcars.com"
}


"use client"

import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Globe } from "lucide-react"
import { useAuthRole } from "@/hooks/use-auth-role"

interface MaintenanceModeSettings {
  enabled: boolean
  message?: string
}

export default function MaintenanceModeSettings() {
  const { profile } = useAuthRole()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<MaintenanceModeSettings>({ enabled: false })
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabaseClient
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "maintenance_mode")
        .single()

      // Handle different error cases
      if (error) {
        // PGRST116 is "not found" - record doesn't exist, we'll create it
        if (error.code === "PGRST116" || error.message?.includes("No rows")) {
          // Create default setting if it doesn't exist
          const defaultSettings: MaintenanceModeSettings = { enabled: false }
          const { error: insertError } = await supabaseClient
            .from("site_settings")
            .insert({
              setting_key: "maintenance_mode",
              setting_value: defaultSettings,
              description: "Controls whether the site shows a maintenance/coming soon page on production domain",
            })

          if (insertError) {
            // If insert fails, might be table doesn't exist or permission issue
            console.error("Error creating maintenance mode setting:", insertError)
            setAlert({ 
              type: "error", 
              message: "Database table not found. Please run the SQL script from scripts/maintenance-mode-schema.sql in your Supabase SQL Editor." 
            })
            // Set default anyway so UI works
            setSettings(defaultSettings)
            return
          }
          setSettings(defaultSettings)
          return
        } else {
          // Other errors (permission, table doesn't exist, etc.)
          console.error("Error fetching maintenance mode settings:", error)
          setAlert({ 
            type: "error", 
            message: error.message || "Failed to load settings. Please ensure the site_settings table exists and you have proper permissions." 
          })
          // Set default so UI doesn't break
          setSettings({ enabled: false })
          return
        }
      }

      // Success - data exists
      if (data?.setting_value) {
        setSettings(data.setting_value as MaintenanceModeSettings)
      } else {
        // Data exists but setting_value is null, use default
        setSettings({ enabled: false })
      }
    } catch (error: any) {
      console.error("Error fetching maintenance mode settings:", error)
      const errorMessage = error?.message || "Failed to load settings. Please try again."
      setAlert({ 
        type: "error", 
        message: errorMessage.includes("relation") || errorMessage.includes("table")
          ? "Database table not found. Please run the SQL script from scripts/maintenance-mode-schema.sql in your Supabase SQL Editor."
          : errorMessage
      })
      // Set default so UI doesn't break
      setSettings({ enabled: false })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (newSettings: MaintenanceModeSettings) => {
    try {
      setSaving(true)
      setAlert(null)

      // First, try to check if the table exists by doing a simple select
      const { error: checkError } = await supabaseClient
        .from("site_settings")
        .select("id")
        .limit(1)

      if (checkError) {
        if (checkError.code === "42P01" || checkError.message?.includes("relation") || checkError.message?.includes("does not exist")) {
          setAlert({ 
            type: "error", 
            message: "Database table 'site_settings' not found. Please run the SQL script from scripts/maintenance-mode-schema.sql in your Supabase SQL Editor." 
          })
          return
        }
      }

      // Now try to upsert
      const { data, error } = await supabaseClient
        .from("site_settings")
        .upsert({
          setting_key: "maintenance_mode",
          setting_value: newSettings,
          description: "Controls whether the site shows a maintenance/coming soon page on production domain",
          updated_by: profile?.id || null,
        }, {
          onConflict: "setting_key"
        })

      if (error) {
        // Log full error for debugging - handle serialization issues
        try {
          console.error("Error object:", error)
          console.error("Error type:", typeof error)
          console.error("Error constructor:", error.constructor?.name)
          console.error("Error keys:", Object.keys(error))
          console.error("Error code:", (error as any).code)
          console.error("Error message:", (error as any).message)
          console.error("Error details:", (error as any).details)
          console.error("Error hint:", (error as any).hint)
          console.error("Error stringified:", JSON.stringify(error, Object.getOwnPropertyNames(error)))
        } catch (e) {
          console.error("Could not serialize error:", e)
        }

        let errorMessage = "Failed to save settings."
        const errorCode = (error as any)?.code
        const errorMsg = (error as any)?.message || String(error)
        const errorDetails = (error as any)?.details
        const errorHint = (error as any)?.hint
        
        // Check for specific error types
        if (errorCode === "42501" || errorMsg?.includes("permission") || errorMsg?.includes("policy") || errorMsg?.includes("row-level security")) {
          errorMessage = "Permission denied. Please ensure you have admin role and the RLS policies are correctly set up. Check that the 'Admins can update site settings' policy exists."
        } else if (errorCode === "42P01" || errorMsg?.includes("relation") || errorMsg?.includes("table") || errorMsg?.includes("does not exist")) {
          errorMessage = "Database table not found. Please run the SQL script from scripts/maintenance-mode-schema.sql in your Supabase SQL Editor."
        } else if (errorCode === "23505") {
          errorMessage = "Duplicate key error. The setting already exists. Try refreshing the page."
        } else if (errorMsg) {
          errorMessage = errorMsg
        } else if (errorDetails) {
          errorMessage = errorDetails
        } else if (errorHint) {
          errorMessage = errorHint
        } else {
          errorMessage = `Failed to save settings. Error code: ${errorCode || "unknown"}`
        }

        setAlert({ 
          type: "error", 
          message: errorMessage
        })
        return
      }

      // Success
      setSettings(newSettings)
      setAlert({
        type: "success",
        message: newSettings.enabled
          ? "Maintenance mode enabled. The coming soon page will be shown on wexcars.com"
          : "Maintenance mode disabled. The website is now accessible on wexcars.com",
      })

      // Clear alert after 5 seconds
      setTimeout(() => setAlert(null), 5000)
    } catch (error: any) {
      // Catch any unexpected errors
      console.error("Unexpected error saving maintenance mode settings:", error)
      console.error("Error type:", typeof error)
      console.error("Error keys:", error ? Object.keys(error) : "no error object")
      
      const errorMessage = error?.message || error?.toString() || "Failed to save settings. Please check your database connection and permissions."
      setAlert({ 
        type: "error", 
        message: errorMessage
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleMaintenanceMode = async (enabled: boolean) => {
    await saveSettings({ ...settings, enabled })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Maintenance Mode
        </CardTitle>
        <CardDescription>
          Control the coming soon page display on the production domain (wexcars.com). 
          Localhost access is always allowed for development.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {alert && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            {alert.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance-mode" className="text-base font-semibold">
                Enable Maintenance Mode
              </Label>
              <p className="text-sm text-gray-600">
                When enabled, visitors to wexcars.com will see the coming soon page.
                <br />
                <span className="text-xs text-gray-500">
                  Note: This only affects the production domain. Localhost access is always allowed.
                </span>
              </p>
            </div>
            <Switch
              id="maintenance-mode"
              checked={settings.enabled}
              onCheckedChange={toggleMaintenanceMode}
              disabled={saving}
            />
          </div>

          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-900">How it works:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Maintenance mode only affects the production domain (wexcars.com)</li>
                  <li>Localhost and development environments always have full access</li>
                  <li>Admin routes (/admin) can still be accessed when maintenance mode is enabled</li>
                  <li>The coming soon page features an animated logo and professional design</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => fetchSettings()}
              variant="outline"
              disabled={saving || loading}
            >
              Refresh
            </Button>
            <Button
              onClick={() => toggleMaintenanceMode(!settings.enabled)}
              disabled={saving}
              variant={settings.enabled ? "outline" : "default"}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : settings.enabled ? (
                "Disable Maintenance Mode"
              ) : (
                "Enable Maintenance Mode"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


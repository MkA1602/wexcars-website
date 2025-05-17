import { createClient } from "@/lib/supabase"

export default async function DbTestPage() {
  let status = "Unknown"
  let error = null
  let dbVersion = null
  let tablesList = []

  try {
    const supabase = createClient()

    // Test 1: Basic connection test
    const { data: versionData, error: versionError } = await supabase.rpc("version")

    if (versionError) {
      status = "Connection Error"
      error = versionError.message
    } else {
      dbVersion = versionData
      status = "Connected"

      // Test 2: Try to list tables
      try {
        const { data: tablesData, error: tablesError } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", "public")
          .order("table_name")

        if (tablesError) {
          error = `Connected, but couldn't list tables: ${tablesError.message}`
        } else {
          tablesList = tablesData.map((t) => t.table_name)
        }
      } catch (tableError) {
        error = `Connected, but error listing tables: ${tableError.message}`
      }
    }
  } catch (e) {
    status = "Exception"
    error = e.message
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Database Connection Test</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Connection Status</h2>
          <div className="mb-4 flex items-center">
            <span className="font-medium mr-2">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                status === "Connected" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
          </div>

          {dbVersion && (
            <div className="mb-4">
              <span className="font-medium">Database Version:</span> {dbVersion}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="font-medium text-red-800 mb-2">Error Details:</h3>
              <p className="text-red-700 whitespace-pre-wrap">{error}</p>
            </div>
          )}
        </div>

        {tablesList.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Database Tables</h2>
            <p className="mb-3 text-gray-600">Found {tablesList.length} tables in the public schema:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {tablesList.map((table) => (
                <li key={table} className="bg-gray-100 px-3 py-2 rounded">
                  {table}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Troubleshooting Steps</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Check that your Supabase URL and API keys are correct</li>
            <li>Verify that your database is online in the Supabase dashboard</li>
            <li>Ensure your IP is not blocked by any firewall rules</li>
            <li>Check for any rate limiting issues</li>
          </ul>
          <div className="mt-6">
            <a
              href="/"
              className="inline-block py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

export default function DbTestError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Database Test Error</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-700">An Error Occurred</h2>
          <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
            <p className="text-red-700 whitespace-pre-wrap">{error.message}</p>
          </div>

          <button
            onClick={reset}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Try Again
          </button>
        </div>

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
              className="inline-block py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

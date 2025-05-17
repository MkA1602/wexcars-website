export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="text-lg mb-6">If you can see this page, basic routing is working.</p>
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting Steps:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Check for console errors in your browser's developer tools</li>
          <li>Verify that all required environment variables are set</li>
          <li>Ensure database connections are properly configured</li>
          <li>Check for syntax errors in your components</li>
        </ul>
      </div>
      <a href="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Return to Home
      </a>
    </div>
  )
}

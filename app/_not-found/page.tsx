import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-3xl font-bold text-primary-600">AutoWex</div>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            Return to Home
          </Link>
          <div className="mt-4">
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

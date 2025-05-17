import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex justify-center">
      <ul className="flex items-center space-x-1">
        <li>
          <Link
            href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage > 1 ? "text-gray-700 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed bg-gray-50"
            }`}
            aria-disabled={currentPage <= 1}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <Link
              href={`?page=${page}`}
              className={`flex items-center justify-center w-10 h-10 rounded-md ${
                currentPage === page ? "bg-primary-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage < totalPages
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-400 cursor-not-allowed bg-gray-50"
            }`}
            aria-disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </li>
      </ul>
    </nav>
  )
}

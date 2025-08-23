"use client"

import { usePathname } from "next/navigation"
import Header from "./header"
import AuthHeader from "./auth-header"

export default function DynamicHeader() {
  const pathname = usePathname()
  
  // Public pages that don't require authentication
  const publicPages = [
    '/',
    '/collections',
    '/pricing', 
    '/about',
    '/contact',
    '/help',
    '/faq',
    '/shipping',
    '/description',
    '/privacy',
    '/terms',
    '/cookies'
  ]
  
  // Check if current page is public
  const isPublicPage = publicPages.some(page => pathname === page || pathname.startsWith(page + '/'))
  
  // Show public header for public pages, auth header for others
  if (isPublicPage) {
    return <Header />
  }
  
  return <AuthHeader />
}

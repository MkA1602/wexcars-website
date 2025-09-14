"use client"

import AuthHeader from "./auth-header"

export default function DynamicHeader() {
  // Always use AuthHeader which handles both authenticated and non-authenticated states
  return <AuthHeader />
}

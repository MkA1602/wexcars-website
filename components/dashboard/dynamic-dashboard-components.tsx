"use client"

import dynamic from "next/dynamic"

// Dynamically import dashboard components with client-side only rendering
export const DynamicDashboardContent = dynamic(() => import("@/components/dashboard/dashboard-wrapper"), {
  loading: () => (
    <div className="w-full p-8 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
})

export const DynamicUserCars = dynamic(() => import("@/components/dashboard/user-cars"), {
  loading: () => (
    <div className="w-full p-8 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
})

export const DynamicAddCarForm = dynamic(() => import("@/components/dashboard/add-car-form"), {
  loading: () => (
    <div className="w-full p-8 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
})

export const DynamicEditCarForm = dynamic(() => import("@/components/dashboard/edit-car-form"), {
  loading: () => (
    <div className="w-full p-8 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
})

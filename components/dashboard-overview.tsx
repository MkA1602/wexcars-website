"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Heart, MessageSquare, Clock, ChevronRight } from "lucide-react"

export default function DashboardOverview() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?key=user-avatar",
    joinDate: "January 2023",
  })

  const [savedCars, setSavedCars] = useState([
    {
      id: "mercedes-s-class",
      title: "Mercedes-Benz S-Class",
      year: 2023,
      price: 89900,
      image: "/placeholder.svg?key=rspkm",
    },
    {
      id: "bmw-7-series",
      title: "BMW 7 Series",
      year: 2023,
      price: 84500,
      image: "/placeholder.svg?key=qzric",
    },
  ])

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "view",
      car: "Porsche 911",
      date: "2 hours ago",
    },
    {
      id: 2,
      type: "save",
      car: "BMW 7 Series",
      date: "1 day ago",
    },
    {
      id: 3,
      type: "message",
      car: "Mercedes-Benz S-Class",
      date: "3 days ago",
    },
  ])

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Price drop alert: Mercedes-Benz S-Class is now $89,900",
      date: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      message: "New cars matching your preferences are available",
      date: "1 day ago",
      read: false,
    },
    {
      id: 3,
      message: "Your inquiry about BMW 7 Series has been answered",
      date: "3 days ago",
      read: true,
    },
  ])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
            <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
            <p className="text-gray-600">Member since {user.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Saved Cars</p>
              <h3 className="text-3xl font-bold">{savedCars.length}</h3>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Heart className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <Link href="/dashboard/saved-cars" className="text-primary-600 text-sm font-medium flex items-center mt-4">
            View all saved cars
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Unread Messages</p>
              <h3 className="text-3xl font-bold">3</h3>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <Link href="/dashboard/messages" className="text-primary-600 text-sm font-medium flex items-center mt-4">
            View all messages
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Recent Views</p>
              <h3 className="text-3xl font-bold">12</h3>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <Link href="/dashboard/history" className="text-primary-600 text-sm font-medium flex items-center mt-4">
            View browsing history
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Saved Cars */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Saved Cars</h2>
          <Link href="/dashboard/saved-cars" className="text-primary-600 text-sm font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedCars.map((car) => (
            <div key={car.id} className="flex border rounded-lg overflow-hidden">
              <div className="relative w-1/3 h-32">
                <Image src={car.image || "/placeholder.svg"} alt={car.title} fill className="object-cover" />
              </div>
              <div className="w-2/3 p-4">
                <h3 className="font-bold">
                  {car.year} {car.title}
                </h3>
                <p className="text-primary-600 font-bold mt-1">${car.price.toLocaleString()}</p>
                <div className="mt-2 flex space-x-2">
                  <Link
                    href={`/inventory/${car.id}`}
                    className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
                  >
                    View Details
                  </Link>
                  <button className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
              <div className="bg-gray-100 p-2 rounded-full mr-4">
                {activity.type === "view" && <Clock className="h-5 w-5 text-gray-600" />}
                {activity.type === "save" && <Heart className="h-5 w-5 text-gray-600" />}
                {activity.type === "message" && <MessageSquare className="h-5 w-5 text-gray-600" />}
              </div>
              <div className="flex-1">
                <p className="text-gray-800">
                  {activity.type === "view" && `You viewed ${activity.car}`}
                  {activity.type === "save" && `You saved ${activity.car} to your favorites`}
                  {activity.type === "message" && `You sent a message about ${activity.car}`}
                </p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button className="text-primary-600 text-sm font-medium">Mark all as read</button>
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start border-b pb-4 last:border-0 last:pb-0 ${notification.read ? "" : "bg-blue-50 -mx-6 px-6"}`}
            >
              <div className={`p-2 rounded-full mr-4 ${notification.read ? "bg-gray-100" : "bg-primary-100"}`}>
                <Bell className={`h-5 w-5 ${notification.read ? "text-gray-600" : "text-primary-600"}`} />
              </div>
              <div className="flex-1">
                <p className={`${notification.read ? "text-gray-800" : "text-gray-900 font-medium"}`}>
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500">{notification.date}</p>
              </div>
              {!notification.read && <div className="h-2 w-2 bg-primary-600 rounded-full mt-2"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

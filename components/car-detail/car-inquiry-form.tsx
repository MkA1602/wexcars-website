"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Check } from "lucide-react"
import type { Car } from "@/lib/types"

interface CarInquiryFormProps {
  car: Car
}

export default function CarInquiryForm({ car }: CarInquiryFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, we would send the form data to a server
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Inquiry Submitted</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in the {car.brand} {car.name}. Our team will contact you shortly.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="border-primary-light text-primary-light hover:bg-primary-light hover:text-white"
          >
            Submit Another Inquiry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Interested in this car?</h2>
      <p className="text-gray-600 mb-6">
        Fill out the form below and our team will get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input id="name" placeholder="John Doe" required />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input id="email" type="email" placeholder="john@example.com" required />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <Input id="phone" placeholder="+1 (555) 123-4567" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Visit Date (Optional)</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <Textarea id="message" placeholder="I'm interested in this car and would like more information..." rows={4} />
        </div>

        <Button type="submit" className="w-full bg-primary-light hover:bg-primary-dark text-white">
          Submit Inquiry
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium">Call us</div>
            <div className="text-gray-600">+1 (555) 123-4567</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium">Email us</div>
            <div className="text-gray-600">info@wexcars.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { X, Phone, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface CarInquiryFormProps {
  isOpen: boolean
  onClose: () => void
  carName: string
  carBrand: string
}

export default function CarInquiryForm({ isOpen, onClose, carName, carBrand }: CarInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    country: "+971", // UAE default
    phone: "",
    email: "",
    discountOffers: false,
    personalInfoAgreement: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const countries = [
    // Middle East & Gulf
    { code: "+971", name: "UAE", flag: "🇦🇪" },
    { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+973", name: "Bahrain", flag: "🇧🇭" },
    { code: "+974", name: "Qatar", flag: "🇶🇦" },
    { code: "+965", name: "Kuwait", flag: "🇰🇼" },
    { code: "+968", name: "Oman", flag: "🇴🇲" },
    { code: "+962", name: "Jordan", flag: "🇯🇴" },
    { code: "+961", name: "Lebanon", flag: "🇱🇧" },
    { code: "+963", name: "Syria", flag: "🇸🇾" },
    { code: "+967", name: "Yemen", flag: "🇾🇪" },
    { code: "+964", name: "Iraq", flag: "🇮🇶" },
    { code: "+98", name: "Iran", flag: "🇮🇷" },
    
    // North Africa
    { code: "+20", name: "Egypt", flag: "🇪🇬" },
    { code: "+212", name: "Morocco", flag: "🇲🇦" },
    { code: "+216", name: "Tunisia", flag: "🇹🇳" },
    { code: "+213", name: "Algeria", flag: "🇩🇿" },
    { code: "+218", name: "Libya", flag: "🇱🇾" },
    { code: "+249", name: "Sudan", flag: "🇸🇩" },
    
    // North America
    { code: "+1", name: "USA/Canada", flag: "🇺🇸" },
    
    // Europe
    { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+43", name: "Austria", flag: "🇦🇹" },
    { code: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "+47", name: "Norway", flag: "🇳🇴" },
    { code: "+45", name: "Denmark", flag: "🇩🇰" },
    { code: "+358", name: "Finland", flag: "🇫🇮" },
    { code: "+48", name: "Poland", flag: "🇵🇱" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+30", name: "Greece", flag: "🇬🇷" },
    { code: "+351", name: "Portugal", flag: "🇵🇹" },
    { code: "+32", name: "Belgium", flag: "🇧🇪" },
    { code: "+352", name: "Luxembourg", flag: "🇱🇺" },
    { code: "+353", name: "Ireland", flag: "🇮🇪" },
    { code: "+375", name: "Belarus", flag: "🇧🇾" },
    { code: "+371", name: "Latvia", flag: "🇱🇻" },
    { code: "+372", name: "Estonia", flag: "🇪🇪" },
    { code: "+370", name: "Lithuania", flag: "🇱🇹" },
    { code: "+380", name: "Ukraine", flag: "🇺🇦" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+90", name: "Turkey", flag: "🇹🇷" },
    { code: "+374", name: "Armenia", flag: "🇦🇲" },
    { code: "+995", name: "Georgia", flag: "🇬🇪" },
    { code: "+994", name: "Azerbaijan", flag: "🇦🇿" },
    
    // Asia Pacific
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+82", name: "South Korea", flag: "🇰🇷" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+60", name: "Malaysia", flag: "🇲🇾" },
    { code: "+66", name: "Thailand", flag: "🇹🇭" },
    { code: "+84", name: "Vietnam", flag: "🇻🇳" },
    { code: "+62", name: "Indonesia", flag: "🇮🇩" },
    { code: "+63", name: "Philippines", flag: "🇵🇭" },
    { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+92", name: "Pakistan", flag: "🇵🇰" },
    { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+95", name: "Myanmar", flag: "🇲🇲" },
    { code: "+856", name: "Laos", flag: "🇱🇦" },
    { code: "+855", name: "Cambodia", flag: "🇰🇭" },
    { code: "+976", name: "Mongolia", flag: "🇲🇳" },
    { code: "+992", name: "Tajikistan", flag: "🇹🇯" },
    { code: "+993", name: "Turkmenistan", flag: "🇹🇲" },
    
    // Oceania
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+64", name: "New Zealand", flag: "🇳🇿" },
    
    // Americas
    { code: "+55", name: "Brazil", flag: "🇧🇷" },
    { code: "+54", name: "Argentina", flag: "🇦🇷" },
    { code: "+56", name: "Chile", flag: "🇨🇱" },
    { code: "+57", name: "Colombia", flag: "🇨🇴" },
    { code: "+58", name: "Venezuela", flag: "🇻🇪" },
    { code: "+51", name: "Peru", flag: "🇵🇪" },
    { code: "+52", name: "Mexico", flag: "🇲🇽" },
    
    // Africa
    { code: "+27", name: "South Africa", flag: "🇿🇦" },
    { code: "+234", name: "Nigeria", flag: "🇳🇬" },
    { code: "+254", name: "Kenya", flag: "🇰🇪" },
    { code: "+233", name: "Ghana", flag: "🇬🇭" },
    { code: "+256", name: "Uganda", flag: "🇺🇬" },
    { code: "+255", name: "Tanzania", flag: "🇹🇿" },
    { code: "+251", name: "Ethiopia", flag: "🇪🇹" }
  ]

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.personalInfoAgreement) {
      newErrors.personalInfoAgreement = "You must agree to provide personal information"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message or redirect
      alert('Thank you for your inquiry! We will get back to you soon.')
      onClose()
      
      // Reset form
      setFormData({
        name: "",
        country: "+971",
        phone: "",
        email: "",
        discountOffers: false,
        personalInfoAgreement: false
      })
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Non-binding reservation</h2>
            <p className="text-gray-600 mt-1">
              Interested in this {carBrand} {carName}? Great! Drop us a line and we'll get back to you.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name and surname *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Name and surname *"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Country and Phone */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Country</Label>
              <div className="relative">
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light appearance-none"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Flag className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="phone">Phone number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Phone number *"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email address *"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discountOffers"
                checked={formData.discountOffers}
                onCheckedChange={(checked) => handleChange('discountOffers', checked as boolean)}
              />
              <Label htmlFor="discountOffers" className="text-sm text-gray-700">
                I wish to receive information about attractive discount offers.
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="personalInfoAgreement"
                checked={formData.personalInfoAgreement}
                onCheckedChange={(checked) => handleChange('personalInfoAgreement', checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="personalInfoAgreement" className="text-sm text-gray-700">
                I agree with providing personal information. *
                {errors.personalInfoAgreement && (
                  <span className="block text-red-500 text-xs mt-1">{errors.personalInfoAgreement}</span>
                )}
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold rounded-lg transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Reserve this car"}
          </Button>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-2">Need help? Call us.</p>
          <div className="flex items-center justify-center gap-2 text-primary-light font-semibold">
            <Phone className="w-4 h-4" />
            <span className="text-lg">+971 50 123 4567</span>
          </div>
        </div>
      </div>
    </div>
  )
}

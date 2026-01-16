"use client"

import { useState } from "react"
import { X, Phone, Flag, Mail, User, MessageCircle, CheckCircle2, Sparkles } from "lucide-react"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modern Header with Gradient */}
        <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-600 p-6 text-white overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Inquiry Form</h2>
                  <p className="text-white/90 text-sm mt-1">
                    {carBrand} {carName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/90 text-sm">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field - Modern Design */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Name and surname <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={`pl-11 h-12 border-2 rounded-xl transition-all ${
                  errors.name 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                    : "border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                }`}
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>•</span> {errors.name}
              </p>
            )}
          </div>

          {/* Country and Phone - Enhanced Design */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Flag className="w-4 h-4 text-gray-500" />
                Country
              </Label>
              <div className="relative">
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full h-12 pl-11 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none bg-white transition-all"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <Flag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                Phone number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className={`pl-11 h-12 border-2 rounded-xl transition-all ${
                    errors.phone 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                  }`}
                />
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span>•</span> {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Email Field - Enhanced Design */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Email address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className={`pl-11 h-12 border-2 rounded-xl transition-all ${
                  errors.email 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                    : "border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                }`}
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>•</span> {errors.email}
              </p>
            )}
          </div>

          {/* Checkboxes - Modern Design */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
              <Checkbox
                id="discountOffers"
                checked={formData.discountOffers}
                onCheckedChange={(checked) => handleChange('discountOffers', checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="discountOffers" className="text-sm text-gray-700 cursor-pointer flex-1 group-hover:text-gray-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>I wish to receive information about attractive discount offers</span>
                </div>
              </Label>
            </div>
            
            <div className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
              errors.personalInfoAgreement 
                ? "bg-red-50 border-2 border-red-200" 
                : "bg-gray-50 hover:bg-gray-100"
            } cursor-pointer group`}>
              <Checkbox
                id="personalInfoAgreement"
                checked={formData.personalInfoAgreement}
                onCheckedChange={(checked) => handleChange('personalInfoAgreement', checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="personalInfoAgreement" className="text-sm text-gray-700 cursor-pointer flex-1 group-hover:text-gray-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${errors.personalInfoAgreement ? 'text-red-500' : 'text-green-500'}`} />
                  <span>I agree with providing personal information <span className="text-red-500">*</span></span>
                </div>
                {errors.personalInfoAgreement && (
                  <span className="block text-red-500 text-xs mt-1.5 ml-6">{errors.personalInfoAgreement}</span>
                )}
              </Label>
            </div>
          </div>

          {/* Submit Button - Modern Design */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Reserve this car
              </span>
            )}
          </Button>
        </form>

        {/* Modern Footer */}
        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Need immediate assistance?</p>
              <a href="tel:+971501234567" className="text-red-600 font-bold text-lg hover:text-red-700 transition-colors">
                +971 50 123 4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

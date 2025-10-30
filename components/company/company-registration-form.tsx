"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Building2, Upload, CreditCard, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface CompanyRegistrationFormProps {
  onSuccess?: () => void
}

interface CompanyData {
  companyName: string
  businessType: string
  registrationNumber: string
  taxId: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  website: string
  description: string
  contactPerson: string
  contactPosition: string
  businessLicense: File | null
  taxCertificate: File | null
  bankDetails: {
    accountHolder: string
    bankName: string
    accountNumber: string
    routingNumber: string
  }
  subscriptionPlan: string
  termsAccepted: boolean
}

const BUSINESS_TYPES = [
  "Car Dealership",
  "Auto Broker",
  "Fleet Management",
  "Car Rental Company",
  "Auction House",
  "Private Collection",
  "Other"
]

const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 99,
    currency: "AED",
    features: [
      "Up to 10 car listings",
      "Basic analytics",
      "Email support",
      "Standard listing duration"
    ],
    popular: false
  },
  {
    id: "professional",
    name: "Professional Plan",
    price: 299,
    currency: "AED",
    features: [
      "Up to 50 car listings",
      "Advanced analytics",
      "Priority support",
      "Featured listings",
      "Social media integration"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 599,
    currency: "AED",
    features: [
      "Unlimited car listings",
      "Premium analytics",
      "Dedicated account manager",
      "Custom branding",
      "API access",
      "White-label options"
    ],
    popular: false
  }
]

export default function CompanyRegistrationForm({ onSuccess }: CompanyRegistrationFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CompanyData>({
    companyName: "",
    businessType: "",
    registrationNumber: "",
    taxId: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    contactPerson: "",
    contactPosition: "",
    businessLicense: null,
    taxCertificate: null,
    bankDetails: {
      accountHolder: "",
      bankName: "",
      accountNumber: "",
      routingNumber: ""
    },
    subscriptionPlan: "professional",
    termsAccepted: false
  })

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CompanyData],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleFileUpload = (field: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in to register your company")
      return
    }

    setIsLoading(true)
    try {
      // Upload documents
      let businessLicenseUrl = ""
      let taxCertificateUrl = ""

      if (formData.businessLicense) {
        const { data: licenseData, error: licenseError } = await supabaseClient.storage
          .from('company-documents')
          .upload(`${user.id}/business-license-${Date.now()}.pdf`, formData.businessLicense)
        
        if (licenseError) throw licenseError
        businessLicenseUrl = licenseData.path
      }

      if (formData.taxCertificate) {
        const { data: taxData, error: taxError } = await supabaseClient.storage
          .from('company-documents')
          .upload(`${user.id}/tax-certificate-${Date.now()}.pdf`, formData.taxCertificate)
        
        if (taxError) throw taxError
        taxCertificateUrl = taxData.path
      }

      // Create company record
      const { data: companyData, error: companyError } = await supabaseClient
        .from('companies')
        .insert({
          user_id: user.id,
          company_name: formData.companyName,
          business_type: formData.businessType,
          registration_number: formData.registrationNumber,
          tax_id: formData.taxId,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          description: formData.description,
          contact_person: formData.contactPerson,
          contact_position: formData.contactPosition,
          business_license_url: businessLicenseUrl,
          tax_certificate_url: taxCertificateUrl,
          bank_details: formData.bankDetails,
          subscription_plan: formData.subscriptionPlan,
          status: 'pending_verification',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (companyError) throw companyError

      // Update user profile
      await supabaseClient
        .from('users')
        .update({
          company_id: companyData.id,
          user_type: 'company'
        })
        .eq('id', user.id)

      toast.success("Company registration submitted successfully! We'll review your application within 24-48 hours.")
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard/company')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || "Failed to register company. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building2 className="w-12 h-12 text-primary-light mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type *</Label>
          <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration Number *</Label>
          <Input
            id="registrationNumber"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            placeholder="Enter registration number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID *</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => handleInputChange('taxId', e.target.value)}
            placeholder="Enter tax ID"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Company Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your business and services"
          rows={4}
          required
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 text-primary-light mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Contact & Location</h2>
        <p className="text-gray-600">Provide your business contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person *</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            placeholder="Full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPosition">Position *</Label>
          <Input
            id="contactPosition"
            value={formData.contactPosition}
            onChange={(e) => handleInputChange('contactPosition', e.target.value)}
            placeholder="Job title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+971 XX XXX XXXX"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Business Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="contact@company.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://www.company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AE">United Arab Emirates</SelectItem>
              <SelectItem value="SA">Saudi Arabia</SelectItem>
              <SelectItem value="KW">Kuwait</SelectItem>
              <SelectItem value="QA">Qatar</SelectItem>
              <SelectItem value="BH">Bahrain</SelectItem>
              <SelectItem value="OM">Oman</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Full business address"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City *</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          placeholder="Enter city"
          required
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Upload className="w-12 h-12 text-primary-light mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Documents & Banking</h2>
        <p className="text-gray-600">Upload required documents and banking details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business License</CardTitle>
            <CardDescription>Upload your business license or trade license</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload('businessLicense', file)
                }}
              />
              {formData.businessLicense && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {formData.businessLicense.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tax Certificate</CardTitle>
            <CardDescription>Upload your tax registration certificate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload('taxCertificate', file)
                }}
              />
              {formData.taxCertificate && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {formData.taxCertificate.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Banking Details</CardTitle>
          <CardDescription>For payment processing and refunds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Account Holder Name *</Label>
              <Input
                id="accountHolder"
                value={formData.bankDetails.accountHolder}
                onChange={(e) => handleInputChange('bankDetails.accountHolder', e.target.value)}
                placeholder="Account holder name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                value={formData.bankDetails.bankName}
                onChange={(e) => handleInputChange('bankDetails.bankName', e.target.value)}
                placeholder="Bank name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleInputChange('bankDetails.accountNumber', e.target.value)}
                placeholder="Account number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number *</Label>
              <Input
                id="routingNumber"
                value={formData.bankDetails.routingNumber}
                onChange={(e) => handleInputChange('bankDetails.routingNumber', e.target.value)}
                placeholder="Routing number"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CreditCard className="w-12 h-12 text-primary-light mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="text-gray-600">Select the subscription plan that fits your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`cursor-pointer transition-all ${
              formData.subscriptionPlan === plan.id 
                ? 'ring-2 ring-primary-light border-primary-light' 
                : 'hover:shadow-lg'
            } ${plan.popular ? 'relative' : ''}`}
            onClick={() => handleInputChange('subscriptionPlan', plan.id)}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary-light text-white">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-primary-light">
                {plan.currency} {plan.price}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Information:</p>
              <ul className="space-y-1">
                <li>• All plans include our standard listing fees (5% per successful sale)</li>
                <li>• You can upgrade or downgrade your plan at any time</li>
                <li>• First month is free for all new company registrations</li>
                <li>• Payment will be processed after verification approval</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to the{" "}
          <a href="/terms" className="text-primary-light hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary-light hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>
    </div>
  )

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.businessType && formData.registrationNumber && formData.taxId && formData.description
      case 2:
        return formData.contactPerson && formData.contactPosition && formData.phone && formData.email && formData.address && formData.city && formData.country
      case 3:
        return formData.businessLicense && formData.taxCertificate && formData.bankDetails.accountHolder && formData.bankDetails.bankName && formData.bankDetails.accountNumber && formData.bankDetails.routingNumber
      case 4:
        return formData.subscriptionPlan && formData.termsAccepted
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Company Registration</CardTitle>
              <CardDescription>
                Step {currentStep} of 4 - Register your business to start listing cars
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-primary-light text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
                className="bg-primary-light hover:bg-primary-dark"
              >
                {isLoading ? "Submitting..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


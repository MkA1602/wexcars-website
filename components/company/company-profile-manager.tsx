"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Upload,
  Edit,
  Save,
  X,
  Eye,
  Download
} from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface CompanyProfile {
  id: string
  company_name: string
  business_type: string
  registration_number: string
  tax_id: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  website: string
  description: string
  contact_person: string
  contact_position: string
  business_license_url: string
  tax_certificate_url: string
  bank_details: any
  subscription_plan: string
  status: string
  verification_status: string
  verification_notes: string
  created_at: string
  updated_at: string
}

export default function CompanyProfileManager() {
  const { user } = useAuth()
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<Partial<CompanyProfile>>({})
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    if (user) {
      fetchCompanyProfile()
    }
  }, [user])

  const fetchCompanyProfile = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabaseClient
        .from('companies')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error) {
        console.error('Error fetching company profile:', error)
        return
      }

      setCompany(data)
      setEditedData(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedData(company || {})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedData(company || {})
  }

  const handleSave = async () => {
    if (!company) return

    try {
      const { error } = await supabaseClient
        .from('companies')
        .update({
          ...editedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', company.id)

      if (error) throw error

      setCompany({ ...company, ...editedData })
      setIsEditing(false)
      toast.success("Company profile updated successfully!")
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(error.message || "Failed to update profile")
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending_verification': { 
        color: 'bg-yellow-100 text-yellow-800', 
        text: 'Pending Verification',
        icon: Clock
      },
      'verified': { 
        color: 'bg-green-100 text-green-800', 
        text: 'Verified',
        icon: CheckCircle
      },
      'suspended': { 
        color: 'bg-red-100 text-red-800', 
        text: 'Suspended',
        icon: AlertCircle
      },
      'rejected': { 
        color: 'bg-red-100 text-red-800', 
        text: 'Rejected',
        icon: AlertCircle
      }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending_verification']
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  const downloadDocument = async (url: string, filename: string) => {
    try {
      const { data, error } = await supabaseClient.storage
        .from('company-documents')
        .download(url)

      if (error) throw error

      const blob = new Blob([data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download error:', error)
      toast.error("Failed to download document")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light mx-auto mb-4"></div>
            <p className="text-gray-600">Loading company profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Company Found</h2>
          <p className="text-gray-600 mb-6">You need to register your company first.</p>
          <Button onClick={() => window.location.href = '/company/register'}>
            Register Your Company
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.company_name}</h1>
            <div className="flex items-center gap-4 mt-2">
              {getStatusBadge(company.status)}
              <span className="text-gray-600">{company.business_type}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600 capitalize">{company.subscription_plan} Plan</span>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Company details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={isEditing ? editedData.company_name || '' : company.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    value={isEditing ? editedData.business_type || '' : company.business_type}
                    onChange={(e) => handleInputChange('business_type', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={isEditing ? editedData.registration_number || '' : company.registration_number}
                    onChange={(e) => handleInputChange('registration_number', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={isEditing ? editedData.tax_id || '' : company.tax_id}
                    onChange={(e) => handleInputChange('tax_id', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={isEditing ? editedData.description || '' : company.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Business contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={isEditing ? editedData.contact_person || '' : company.contact_person}
                    onChange={(e) => handleInputChange('contact_person', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPosition">Position</Label>
                  <Input
                    id="contactPosition"
                    value={isEditing ? editedData.contact_position || '' : company.contact_position}
                    onChange={(e) => handleInputChange('contact_position', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={isEditing ? editedData.phone || '' : company.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedData.email || '' : company.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={isEditing ? editedData.website || '' : company.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Business location details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={isEditing ? editedData.country || '' : company.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={isEditing ? editedData.city || '' : company.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={isEditing ? editedData.address || '' : company.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Company Documents
              </CardTitle>
              <CardDescription>
                Uploaded business documents and certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business License */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business License</CardTitle>
                    <CardDescription>Trade license or business registration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {company.business_license_url ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-800 font-medium">Document uploaded</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadDocument(company.business_license_url, 'business-license.pdf')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No document uploaded</p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Document
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tax Certificate */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tax Certificate</CardTitle>
                    <CardDescription>Tax registration certificate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {company.tax_certificate_url ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-800 font-medium">Document uploaded</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadDocument(company.tax_certificate_url, 'tax-certificate.pdf')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No document uploaded</p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Document
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification Status
              </CardTitle>
              <CardDescription>
                Current verification status and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Overview */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Verification Status</p>
                  <p className="text-sm text-gray-600">Current verification level</p>
                </div>
                {getStatusBadge(company.status)}
              </div>

              {/* Verification Notes */}
              {company.verification_notes && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Verification Notes:</p>
                        <p>{company.verification_notes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Requirements Checklist */}
              <div className="space-y-4">
                <h3 className="font-semibold">Verification Requirements</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${company.business_license_url ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={company.business_license_url ? 'text-green-700' : 'text-gray-600'}>
                      Business License uploaded
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${company.tax_certificate_url ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={company.tax_certificate_url ? 'text-green-700' : 'text-gray-600'}>
                      Tax Certificate uploaded
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${company.company_name ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={company.company_name ? 'text-green-700' : 'text-gray-600'}>
                      Company information completed
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${company.contact_person ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={company.contact_person ? 'text-green-700' : 'text-gray-600'}>
                      Contact information provided
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              {company.status === 'pending_verification' && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Next Steps:</p>
                        <ul className="space-y-1">
                          <li>• Our team will review your documents within 24-48 hours</li>
                          <li>• You'll receive an email notification once verification is complete</li>
                          <li>• You can start listing cars immediately after verification</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Subscription Plan</p>
                    <p className="text-sm text-gray-600">Current plan and billing</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold capitalize">{company.subscription_plan} Plan</p>
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Account Status</p>
                    <p className="text-sm text-gray-600">Current account status</p>
                  </div>
                  {getStatusBadge(company.status)}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p className="text-sm text-gray-600">Account creation date</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(company.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" size="sm">
                  Deactivate Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


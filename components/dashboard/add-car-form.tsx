"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Upload, X, Camera, ExternalLink, Plus, Check } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Common car features for selection
const CAR_FEATURES = [
  "GPS Navigation", "Bluetooth", "Heated Seats", "Sunroof", "Leather Seats", 
  "Parking Sensors", "Backup Camera", "Apple CarPlay", "Android Auto", "Cruise Control",
  "Lane Assist", "Adaptive Cruise Control", "Blind Spot Monitoring", "360° Camera",
  "Wireless Charging", "Premium Sound System", "Ventilated Seats", "Memory Seats",
  "Keyless Entry", "Push Button Start", "Heads-Up Display", "Night Vision",
  "Massage Seats", "Rear Entertainment", "Panoramic Roof", "Air Suspension"
]

export default function AddCarForm() {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    year: new Date().getFullYear(),
    price: "",
    priceExclVat: "",
    vatRate: "5", // Default VAT rate for UAE
    currency: "AED", // Default to AED
    image: "",
    description: "",
    features: [] as string[],
    // Additional car details
    transmission: "",
    color: "",
    availability: "Available",
    fuel_type: "",
    seats: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { user } = useAuth()
  const router = useRouter()

  // Calculate prices based on VAT
  const calculatePrices = (priceExclVat: string, vatRate: string) => {
    const priceNum = parseFloat(priceExclVat)
    const vatNum = parseFloat(vatRate)
    
    if (isNaN(priceNum) || isNaN(vatNum)) return { priceWithVat: "", vatAmount: "" }
    
    const vatAmount = (priceNum * vatNum) / 100
    const priceWithVat = priceNum + vatAmount
    
    return {
      priceWithVat: priceWithVat.toFixed(2),
      vatAmount: vatAmount.toFixed(2)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Car name is required"
    }

    // Validate brand
    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required"
    }

    // Validate category
    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    // Validate year
    const currentYear = new Date().getFullYear()
    if (!formData.year) {
      newErrors.year = "Year is required"
    } else if (formData.year < 1900 || formData.year > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`
    }

    // Validate price (excluding VAT)
    if (!formData.priceExclVat) {
      newErrors.priceExclVat = "Price (excl. VAT) is required"
    } else if (isNaN(Number(formData.priceExclVat)) || Number(formData.priceExclVat) <= 0) {
      newErrors.priceExclVat = "Price must be a positive number"
    }

    // Validate VAT rate
    if (!formData.vatRate) {
      newErrors.vatRate = "VAT rate is required"
    } else if (isNaN(Number(formData.vatRate)) || Number(formData.vatRate) < 0) {
      newErrors.vatRate = "VAT rate must be a valid percentage"
    }

    // Validate image(s)
    if (uploadMethod === 'url') {
      if (!formData.image.trim()) {
        newErrors.image = "Image URL is required"
      } else if (!/^https?:\/\/.+/.test(formData.image)) {
        newErrors.image = "Please enter a valid image URL"
      }
    } else {
      if (selectedFiles.length === 0 && previewUrls.length === 0) {
        newErrors.image = "Please select at least one image file"
      }
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Auto-calculate price with VAT when price excluding VAT or VAT rate changes
    if (name === 'priceExclVat' || name === 'vatRate') {
      const priceExclVat = name === 'priceExclVat' ? value : formData.priceExclVat
      const vatRate = name === 'vatRate' ? value : formData.vatRate
      
      const { priceWithVat } = calculatePrices(priceExclVat, vatRate)
      if (priceWithVat) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          price: priceWithVat
        }))
      }
    }
  }

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleFilesSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== fileArray.length) {
      setServerError("Some files were skipped. Please ensure all files are images under 10MB")
    } else {
      setServerError(null)
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles])
      
      // Create preview URLs
      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrls(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })

      // Clear errors if files are selected
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelect(e.target.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const clearAllFiles = () => {
    setSelectedFiles([])
    setPreviewUrls([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    // In a real app, you'd upload to a service like Cloudinary, AWS S3, etc.
    // For demo purposes, we'll create data URLs and simulate upload
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          // Simulate upload delay
          setTimeout(() => {
            resolve(reader.result as string)
          }, 500)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    return Promise.all(uploadPromises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors)
      return
    }

    if (!user?.id) {
      console.error('No user ID found')
      setServerError("Please sign in to add a car")
      return
    }

    setIsSubmitting(true)
    setServerError("")

    try {
      console.log('Starting car submission process...')
      console.log('User ID:', user.id)
      console.log('Form data:', formData)

      // Upload images first if any files are selected
      let imageUrls: string[] = []
      if (selectedFiles.length > 0) {
        console.log('Uploading images...', selectedFiles.length, 'files')
        imageUrls = await uploadImagesToCloudinary(selectedFiles)
        console.log('Images uploaded successfully:', imageUrls)
      } else if (formData.image) {
        console.log('Using single image URL:', formData.image)
        imageUrls = [formData.image]
      }

      // Calculate final prices
      const { priceWithVat, vatAmount } = calculatePrices(formData.priceExclVat, formData.vatRate)
      console.log('Calculated prices:', { priceWithVat, vatAmount })

      // Add car to database with all the new fields
      const carData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        year: Number(formData.year),
        price: Number(priceWithVat),
        price_excl_vat: Number(formData.priceExclVat),
        vat_rate: Number(formData.vatRate),
        vat_amount: Number(vatAmount),
        currency: formData.currency,
        image: imageUrls[0] || formData.image, // Primary image
        images: imageUrls.length > 1 ? JSON.stringify(imageUrls) : null, // Additional images as JSON
        description: formData.description,
        features: formData.features.length > 0 ? JSON.stringify(formData.features) : null,
        user_id: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        transmission: formData.transmission,
        color: formData.color,
        // TODO: Add these fields after updating database schema
        // availability: formData.availability,
        // fuel_type: formData.fuel_type,
        // seats: formData.seats,
      }

      console.log('Inserting car data:', carData)

      const { error } = await supabaseClient.from("cars").insert(carData)

      if (error) {
        console.error('Supabase insert error:', error)
        throw error
      }

      console.log('Car added successfully!')

      // Success message
      setServerError("Car added successfully! Redirecting to dashboard...")
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error('Car submission error:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      setServerError(error.message || "Failed to add car")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate display values
  const { priceWithVat, vatAmount } = calculatePrices(formData.priceExclVat, formData.vatRate)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard" className="text-primary-light hover:underline flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        <CardTitle>Add New Car</CardTitle>
        <CardDescription>Add a new car to your collection</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <Alert variant={serverError.includes('successfully') ? "default" : "destructive"} className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Car Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. 911 Carrera"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Porsche"
                className={errors.brand ? "border-red-500" : ""}
              />
              {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
            </div>
          </div>

          {/* Category and Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Category</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="Sports Car">Sports Car</option>
                <option value="Luxury">Luxury</option>
                <option value="Supercar">Supercar</option>
                <option value="Hypercar">Hypercar</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2023"
                className={errors.year ? "border-red-500" : ""}
              />
              {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">Pricing Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="priceExclVat">Price (excl. VAT)</Label>
                <div className="flex gap-2">
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="AED">AED</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <Input
                    id="priceExclVat"
                    name="priceExclVat"
                    type="number"
                    step="0.01"
                    value={formData.priceExclVat}
                    onChange={handleChange}
                    placeholder="e.g. 100000"
                    className={`flex-1 ${errors.priceExclVat ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.priceExclVat && <p className="text-red-500 text-sm">{errors.priceExclVat}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vatRate">VAT Rate (%)</Label>
                <Input
                  id="vatRate"
                  name="vatRate"
                  type="number"
                  step="0.01"
                  value={formData.vatRate}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className={errors.vatRate ? "border-red-500" : ""}
                />
                {errors.vatRate && <p className="text-red-500 text-sm">{errors.vatRate}</p>}
              </div>

              <div className="space-y-2">
                <Label>Price Summary</Label>
                <div className="bg-white p-3 border rounded-md space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Price (excl. VAT):</span>
                    <span>{formData.priceExclVat ? `${formData.currency} ${formData.priceExclVat}` : '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT ({formData.vatRate}%):</span>
                    <span>{vatAmount ? `${formData.currency} ${vatAmount}` : '-'}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total (incl. VAT):</span>
                    <span>{priceWithVat ? `${formData.currency} ${priceWithVat}` : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Car Features Section */}
          <div className="space-y-4">
            <Label>Car Features</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {CAR_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                      formData.features.includes(feature)
                        ? 'bg-primary-light text-white border-primary-light'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-light'
                    }`}
                  >
                    {formData.features.includes(feature) && <Check size={14} />}
                    <span>{feature}</span>
                  </button>
                </div>
              ))}
            </div>
            
            {formData.features.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Selected Features ({formData.features.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <Badge key={feature} variant="default" className="bg-primary-light">
                      {feature}
                      <button
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className="ml-1 hover:bg-primary-dark rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Car Images</Label>
            
            {/* Upload Method Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMethod('file')}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Upload from Device
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMethod('url')}
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Use Image URL
              </Button>
            </div>

            {uploadMethod === 'file' ? (
              <div className="space-y-4">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : errors.image
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>

                {/* File Preview */}
                {previewUrls.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Selected Images ({previewUrls.length})</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearAllFiles}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/car-image.jpg"
                  className={errors.image ? "border-red-500" : ""}
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded-lg border"
                      onError={() => setErrors(prev => ({ ...prev, image: "Invalid image URL" }))}
                    />
                  </div>
                )}
              </div>
            )}
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the car in detail..."
              rows={5}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <Label>Additional Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Input
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  placeholder="e.g. Automatic"
                  className={errors.transmission ? "border-red-500" : ""}
                />
                {errors.transmission && <p className="text-red-500 text-sm">{errors.transmission}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g. Black"
                  className={errors.color ? "border-red-500" : ""}
                />
                {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.availability ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Reserved">Reserved</option>
                </select>
                {errors.availability && <p className="text-red-500 text-sm">{errors.availability}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Input
                  id="fuel_type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  placeholder="e.g. Gasoline"
                  className={errors.fuel_type ? "border-red-500" : ""}
                />
                {errors.fuel_type && <p className="text-red-500 text-sm">{errors.fuel_type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  value={formData.seats}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                  className={errors.seats ? "border-red-500" : ""}
                />
                {errors.seats && <p className="text-red-500 text-sm">{errors.seats}</p>}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-primary-light hover:bg-primary-dark text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Car..." : "Add Car"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}



"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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

interface EditCarFormProps {
  car: any
}

// Common car features for selection
const CAR_FEATURES = [
  "GPS Navigation", "Bluetooth", "Heated Seats", "Sunroof", "Leather Seats", 
  "Parking Sensors", "Backup Camera", "Apple CarPlay", "Android Auto", "Cruise Control",
  "Lane Assist", "Adaptive Cruise Control", "Blind Spot Monitoring", "360° Camera",
  "Wireless Charging", "Premium Sound System", "Ventilated Seats", "Memory Seats",
  "Keyless Entry", "Push Button Start", "Heads-Up Display", "Night Vision",
  "Massage Seats", "Rear Entertainment", "Panoramic Roof", "Air Suspension"
]

export default function EditCarForm({ car }: EditCarFormProps) {
  const [formData, setFormData] = useState({
    name: car.name || "",
    brand: car.brand || "",
    category: car.category || "",
    year: car.year || new Date().getFullYear(),
    price: car.price || "",
    currency: car.currency || "EUR",
    image: car.image || "",
    description: car.description || "",
    // Additional car details
    transmission: car.transmission || "",
    color: car.color || "",
    availability: car.availability || "Available",
    fuel_type: car.fuel_type || "",
    gearbox: car.gearbox || "",
    mileage: car.mileage || "",
    car_type: car.car_type || "",
    horsepower: car.horsepower || "",
    engine_size: car.engine_size || "",
    drivetrain: car.drivetrain || "",
    chassis_number: car.chassis_number || "",
    location: car.location || "",
    seats: car.seats || "",
    certificate_of_conformity: car.certificate_of_conformity || "",
    service_book: car.service_book || "",
    ref_no: car.ref_no || "",
    emission_class: car.emission_class || "",
    first_registration: car.first_registration || "",
    crash_history: car.crash_history || "",
    features: car.features ? JSON.parse(car.features) : [],
    // Seller information
    seller_type: car.seller_type || "individual",
    dealership_name: car.dealership_name || "",
    // New pricing and admin features
    is_netto_price: car.is_netto_price || false,
    is_new_car: car.is_new_car || false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [customFeature, setCustomFeature] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { user } = useAuth()
  const router = useRouter()

  // Initialize existing images
  useEffect(() => {
    const initializeImages = () => {
      const images: string[] = []
      
      // Add primary image
      if (car.image) {
        images.push(car.image)
      }
      
      // Add additional images if they exist
      if (car.images) {
        try {
          const additionalImages = JSON.parse(car.images)
          if (Array.isArray(additionalImages)) {
            // Filter out the primary image to avoid duplicates
            const uniqueAdditional = additionalImages.filter(img => img !== car.image)
            images.push(...uniqueAdditional)
          }
        } catch (e) {
          console.warn('Failed to parse additional images:', e)
        }
      }
      
      setExistingImages(images)
      setPreviewUrls(images)
    }

    initializeImages()
  }, [car])

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

    // Validate price
    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    // Validate image(s)
    if (uploadMethod === 'url') {
      if (!formData.image.trim()) {
        newErrors.image = "Image URL is required"
      } else if (!/^https?:\/\/.+/.test(formData.image) && !formData.image.startsWith('data:image/')) {
        newErrors.image = "Please enter a valid image URL or use the file upload option"
      } else {
        // Clear image error if we have a valid image
        if (newErrors.image) {
          delete newErrors.image
        }
      }
    } else {
      if (selectedFiles.length === 0 && previewUrls.length === 0) {
        newErrors.image = "Please select at least one image file"
      } else {
        // Clear image error if we have files
        if (newErrors.image) {
          delete newErrors.image
        }
      }
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters"
    }

    // Validate dealership name if seller type is dealership
    if (formData.seller_type === 'dealership' && !formData.dealership_name.trim()) {
      newErrors.dealership_name = "Dealership name is required when selling as a dealership"
    }

    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFilesSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles: File[] = []

    // Validate each file
    for (const file of fileArray) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: `${file.name} is not a valid image file` }))
        continue
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: `${file.name} is too large (max 10MB)` }))
        continue
      }

      validFiles.push(file)
    }

    // Check total files limit (max 30 images)
    const totalFiles = previewUrls.length + validFiles.length
    if (totalFiles > 30) {
      setErrors((prev) => ({ ...prev, image: `Maximum 30 images allowed. You can add ${30 - previewUrls.length} more images.` }))
      return
    }

    // Create preview URLs for valid files
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        setPreviewUrls(prev => [...prev, url])
      }
      reader.readAsDataURL(file)
    })

    // Add valid files to selected files
    setSelectedFiles(prev => [...prev, ...validFiles])

    // Clear any existing errors if files are valid
    if (validFiles.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.image
        return newErrors
      })
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFilesSelect(files)
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
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFilesSelect(files)
    }
  }

  const removeImage = (index: number) => {
    // If it's a new file, remove from selectedFiles too
    const urlToRemove = previewUrls[index]
    const existingIndex = existingImages.indexOf(urlToRemove)
    
    if (existingIndex === -1) {
      // It's a new file, find and remove it from selectedFiles
      const newFileIndex = previewUrls.slice(0, index).filter(url => !existingImages.includes(url)).length
      setSelectedFiles(prev => prev.filter((_, i) => i !== newFileIndex))
    }
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const setPrimaryImage = (index: number) => {
    if (index === 0) return // Already primary
    
    setPreviewUrls(prev => {
      const newUrls = [...prev]
      const primaryUrl = newUrls[0]
      newUrls[0] = newUrls[index]
      newUrls[index] = primaryUrl
      return newUrls
    })
  }

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setPreviewUrls(prev => {
      const newUrls = [...prev]
      const [movedUrl] = newUrls.splice(fromIndex, 1)
      newUrls.splice(toIndex, 0, movedUrl)
      return newUrls
    })
  }

  const clearAllImages = () => {
    setSelectedFiles([])
    setPreviewUrls(existingImages)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const clearAllIncludingExisting = () => {
    setSelectedFiles([])
    setPreviewUrls([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    // In a real app, you'd upload to a service like Cloudinary, AWS S3, etc.
    // For demo purposes, we'll convert to base64 and create mock URLs
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(file)
      })
    })

    return Promise.all(uploadPromises)
  }

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f: string) => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const addCustomFeature = () => {
    if (customFeature.trim() && !formData.features.includes(customFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, customFeature.trim()]
      }))
      setCustomFeature("")
    }
  }

  const handleCustomFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCustomFeature()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error
    setServerError(null)

    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)

    try {
      let allImageUrls: string[] = []

      // If using file upload method, combine existing and new images
      if (uploadMethod === 'file') {
        // Keep existing images that are still in previewUrls
        const keptExistingImages = previewUrls.filter(url => existingImages.includes(url))
        
        // Upload new files
        let newImageUrls: string[] = []
        if (selectedFiles.length > 0) {
          try {
            newImageUrls = await uploadImagesToCloudinary(selectedFiles)
          } catch (uploadError) {
            throw new Error('Failed to upload images. Please try again.')
          }
        }
        
        allImageUrls = [...keptExistingImages, ...newImageUrls]
      } else {
        // Use single URL for URL method
        allImageUrls = [formData.image]
      }

      // Update car in database with primary image and additional images
      const updateData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        year: Number(formData.year),
        price: Number(formData.price),
        currency: formData.currency,
        image: allImageUrls[0] || formData.image, // Primary image
        images: allImageUrls.length > 1 ? JSON.stringify(allImageUrls) : null, // Additional images as JSON
        description: formData.description,
        features: formData.features.length > 0 ? JSON.stringify(formData.features) : null,
        transmission: formData.transmission,
        color: formData.color,
        availability: formData.availability,
        fuel_type: formData.fuel_type,
        gearbox: formData.gearbox,
        mileage: formData.is_new_car ? null : (formData.mileage ? Number(formData.mileage) : null),
        car_type: formData.car_type,
        horsepower: formData.horsepower ? Number(formData.horsepower) : null,
        engine_size: formData.engine_size,
        drivetrain: formData.drivetrain,
        chassis_number: formData.chassis_number,
        location: formData.location,
        seats: formData.seats,
        certificate_of_conformity: formData.certificate_of_conformity,
        service_book: formData.service_book,
        ref_no: formData.ref_no,
        emission_class: formData.emission_class,
        first_registration: formData.first_registration,
        crash_history: formData.crash_history,
        seller_type: formData.seller_type,
        dealership_name: formData.seller_type === 'dealership' ? formData.dealership_name : null,
        // New pricing and admin features
        is_netto_price: formData.is_netto_price,
        is_new_car: formData.is_new_car,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabaseClient
        .from("cars")
        .update(updateData)
        .eq("id", car.id)
        .eq("user_id", user?.id) // Ensure the car belongs to the user

      if (error) {
        throw error
      }

      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      setServerError(error.message || "Failed to update car")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard" className="text-primary-light hover:underline flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        <CardTitle>Edit Car</CardTitle>
        <CardDescription>Update car information</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="space-y-2">
              <Label htmlFor="price">
                {formData.is_netto_price ? "Netto Price" : "Price"}
              </Label>
              <div className="flex gap-2">
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                  <option value="JPY">¥ JPY</option>
                  <option value="AED">د.إ AED</option>
                </select>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 100000"
                  className={`flex-1 ${errors.price ? "border-red-500" : ""}`}
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              {formData.is_netto_price && (
                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  ℹ️ This is your netto price. No VAT calculation or service fee will be applied.
                </p>
              )}
            </div>
          </div>

          {/* Seller Information Section */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">Seller Information</h3>
            
            <div className="space-y-4">
              {/* Seller Type Selection */}
              <div className="space-y-3">
                <Label>Seller Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="seller_type"
                      value="individual"
                      checked={formData.seller_type === 'individual'}
                      onChange={handleChange}
                      className="text-primary-light focus:ring-primary-light"
                    />
                    <span>Individual User</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="seller_type"
                      value="dealership"
                      checked={formData.seller_type === 'dealership'}
                      onChange={handleChange}
                      className="text-primary-light focus:ring-primary-light"
                    />
                    <span>Dealership</span>
                  </label>
                </div>
              </div>

              {/* Dealership Name Input */}
              {formData.seller_type === 'dealership' && (
                <div className="space-y-2">
                  <Label htmlFor="dealership_name">Dealership Name</Label>
                  <Input
                    id="dealership_name"
                    name="dealership_name"
                    value={formData.dealership_name}
                    onChange={handleChange}
                    placeholder="Enter your dealership name"
                    className={errors.dealership_name ? "border-red-500" : ""}
                  />
                  {errors.dealership_name && <p className="text-red-500 text-sm">{errors.dealership_name}</p>}
                </div>
              )}
            </div>
          </div>

          {/* New Car and Pricing Options */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">Car Status & Pricing Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Car Option */}
              <div className="space-y-3">
                <Label>Car Status</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="car_status"
                      value="used"
                      checked={!formData.is_new_car}
                      onChange={() => setFormData(prev => ({ ...prev, is_new_car: false }))}
                      className="text-primary-light focus:ring-primary-light"
                    />
                    <span>Used Car (with mileage)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="car_status"
                      value="new"
                      checked={formData.is_new_car}
                      onChange={() => setFormData(prev => ({ ...prev, is_new_car: true, mileage: "" }))}
                      className="text-primary-light focus:ring-primary-light"
                    />
                    <span>New Car (no mileage required)</span>
                  </label>
                </div>
                {formData.is_new_car && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    ✓ New car selected - mileage field will be hidden
                  </p>
                )}
              </div>

              {/* Netto Price Option */}
              <div className="space-y-3">
                <Label>Pricing Type</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pricing_type"
                      value="standard"
                      checked={!formData.is_netto_price}
                      onChange={() => setFormData(prev => ({ ...prev, is_netto_price: false }))}
                      className="text-primary-light focus:ring-primary-light"
                    />
                    <span>Standard Pricing (with service fee)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pricing_type"
                      value="netto"
                      checked={formData.is_netto_price}
                      onChange={() => setFormData(prev => ({ ...prev, is_netto_price: true }))}
                      className="text-primary-light focus:ring-primary-light"
                    />
                    <span>Netto Price (no service fee calculation)</span>
                  </label>
                </div>
                {formData.is_netto_price && (
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    ℹ️ Netto pricing selected - service fee calculation will be skipped
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Car Details Section */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">Car Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Transmission */}
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>

              {/* Gearbox */}
              <div className="space-y-2">
                <Label htmlFor="gearbox">Gearbox</Label>
                <select
                  id="gearbox"
                  name="gearbox"
                  value={formData.gearbox}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Gearbox</option>
                  <option value="6-Speed Manual">6-Speed Manual</option>
                  <option value="7-Speed Automatic">7-Speed Automatic</option>
                  <option value="8-Speed Automatic">8-Speed Automatic</option>
                  <option value="9-Speed Automatic">9-Speed Automatic</option>
                  <option value="10-Speed Automatic">10-Speed Automatic</option>
                  <option value="CVT">CVT</option>
                  <option value="Dual-Clutch">Dual-Clutch</option>
                </select>
              </div>

              {/* Color */}
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

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                </select>
              </div>

              {/* Mileage - Only show for used cars */}
              {!formData.is_new_car && (
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="e.g. 10000"
                    className={errors.mileage ? "border-red-500" : ""}
                  />
                  {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage}</p>}
                </div>
              )}

              {/* Car Type */}
              <div className="space-y-2">
                <Label htmlFor="car_type">Car Type</Label>
                <select
                  id="car_type"
                  name="car_type"
                  value={formData.car_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Car Type</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Crossover">Crossover</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Wagon">Wagon</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Sports Car">Sports Car</option>
                  <option value="Supercar">Supercar</option>
                </select>
              </div>

              {/* Horsepower */}
              <div className="space-y-2">
                <Label htmlFor="horsepower">Horsepower (HP)</Label>
                <Input
                  id="horsepower"
                  name="horsepower"
                  type="number"
                  value={formData.horsepower}
                  onChange={handleChange}
                  placeholder="e.g. 400"
                  className={errors.horsepower ? "border-red-500" : ""}
                />
                {errors.horsepower && <p className="text-red-500 text-sm">{errors.horsepower}</p>}
              </div>

              {/* Engine Size */}
              <div className="space-y-2">
                <Label htmlFor="engine_size">Engine Size</Label>
                <Input
                  id="engine_size"
                  name="engine_size"
                  value={formData.engine_size}
                  onChange={handleChange}
                  placeholder="e.g. 3.8L V8"
                  className={errors.engine_size ? "border-red-500" : ""}
                />
                {errors.engine_size && <p className="text-red-500 text-sm">{errors.engine_size}</p>}
              </div>

              {/* Drivetrain */}
              <div className="space-y-2">
                <Label htmlFor="drivetrain">Drivetrain</Label>
                <select
                  id="drivetrain"
                  name="drivetrain"
                  value={formData.drivetrain}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Drivetrain</option>
                  <option value="Front-Wheel Drive">Front-Wheel Drive (FWD)</option>
                  <option value="Rear-Wheel Drive">Rear-Wheel Drive (RWD)</option>
                  <option value="All-Wheel Drive">All-Wheel Drive (AWD)</option>
                  <option value="Four-Wheel Drive">Four-Wheel Drive (4WD)</option>
                </select>
              </div>

              {/* Chassis Number */}
              <div className="space-y-2">
                <Label htmlFor="chassis_number">Chassis Number (VIN)</Label>
                <Input
                  id="chassis_number"
                  name="chassis_number"
                  value={formData.chassis_number}
                  onChange={handleChange}
                  placeholder="e.g. WBA12345678901234"
                  className={errors.chassis_number ? "border-red-500" : ""}
                />
                {errors.chassis_number && <p className="text-red-500 text-sm">{errors.chassis_number}</p>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Dubai, UAE"
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>

              {/* Seats */}
              <div className="space-y-2">
                <Label htmlFor="seats">Number of Seats</Label>
                <select
                  id="seats"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Number of Seats</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </select>
              </div>

              {/* Certificate of Conformity */}
              <div className="space-y-2">
                <Label htmlFor="certificate_of_conformity">Certificate of Conformity</Label>
                <select
                  id="certificate_of_conformity"
                  name="certificate_of_conformity"
                  value={formData.certificate_of_conformity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Service Book */}
              <div className="space-y-2">
                <Label htmlFor="service_book">Service Book</Label>
                <select
                  id="service_book"
                  name="service_book"
                  value={formData.service_book}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Reference Number */}
              <div className="space-y-2">
                <Label htmlFor="ref_no">Reference Number</Label>
                <Input
                  id="ref_no"
                  name="ref_no"
                  value={formData.ref_no}
                  onChange={handleChange}
                  placeholder="e.g. REF123456"
                  className={errors.ref_no ? "border-red-500" : ""}
                />
                {errors.ref_no && <p className="text-red-500 text-sm">{errors.ref_no}</p>}
              </div>

              {/* Emission Class */}
              <div className="space-y-2">
                <Label htmlFor="emission_class">Emission Class</Label>
                <select
                  id="emission_class"
                  name="emission_class"
                  value={formData.emission_class}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Emission Class</option>
                  <option value="Euro 1">Euro 1</option>
                  <option value="Euro 2">Euro 2</option>
                  <option value="Euro 3">Euro 3</option>
                  <option value="Euro 4">Euro 4</option>
                  <option value="Euro 5">Euro 5</option>
                  <option value="Euro 6">Euro 6</option>
                </select>
              </div>

              {/* First Registration */}
              <div className="space-y-2">
                <Label htmlFor="first_registration">First Registration Date</Label>
                <Input
                  id="first_registration"
                  name="first_registration"
                  type="date"
                  value={formData.first_registration}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">When the car was first registered</p>
              </div>

              {/* Crash History */}
              <div className="space-y-2">
                <Label htmlFor="crash_history">Crash/Accident History</Label>
                <select
                  id="crash_history"
                  name="crash_history"
                  value={formData.crash_history}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select Option</option>
                  <option value="No accidents">No accidents</option>
                  <option value="Minor accident">Minor accident</option>
                  <option value="Moderate accident">Moderate accident</option>
                  <option value="Major accident">Major accident</option>
                  <option value="Salvage/Totaled">Salvage/Totaled</option>
                  <option value="Unknown">Unknown</option>
                </select>
                <p className="text-xs text-gray-500">Select the most accurate description of the car's accident history</p>
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
            
            {/* Custom Feature Input */}
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <Label htmlFor="customFeature" className="text-sm font-medium">Add Custom Feature</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="customFeature"
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  onKeyPress={handleCustomFeatureKeyPress}
                  placeholder="e.g. Sport Exhaust, Carbon Fiber Interior..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addCustomFeature}
                  variant="outline"
                  className="flex items-center gap-1"
                  disabled={!customFeature.trim() || formData.features.includes(customFeature.trim())}
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Add custom features that aren't in the list above
              </p>
            </div>
            
            {formData.features.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Selected Features ({formData.features.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature: string) => (
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
            <Label>Car Image</Label>
            
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
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  {previewUrls.length > 0 ? (
                    <div className="space-y-4">
                      {/* Image Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previewUrls.map((url, index) => (
                          <div 
                            key={index} 
                            className="relative group cursor-move"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', index.toString())
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault()
                              const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
                              const toIndex = index
                              if (fromIndex !== toIndex) {
                                reorderImages(fromIndex, toIndex)
                              }
                            }}
                          >
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 rounded-full p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X size={12} />
                            </Button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Primary
                              </div>
                            )}
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(index)}
                                className="absolute bottom-1 left-1 bg-gray-600 hover:bg-blue-500 text-white text-xs px-2 py-1 rounded transition-colors"
                                title="Set as primary image"
                              >
                                Set Primary
                              </button>
                            )}
                            {existingImages.includes(url) && (
                              <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                Saved
                              </div>
                            )}
                            <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-green-600 font-medium">
                          ✓ {previewUrls.length}/30 image{previewUrls.length !== 1 ? 's' : ''} total
                          {selectedFiles.length > 0 && ` (${selectedFiles.length} new)`}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1"
                            disabled={previewUrls.length >= 30}
                          >
                            <Plus size={14} />
                            Add More
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={clearAllImages}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <X size={14} />
                            Clear New
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={clearAllIncludingExisting}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <X size={14} />
                            Clear All
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Drag and drop images to reorder. The first image will be the primary image.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera size={48} className="mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium">
                          Drag and drop images here, or{' '}
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto text-primary underline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            browse files
                          </Button>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Supports: JPG, PNG, GIF, WebP (max 10MB each, 30 images max)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/car-image.jpg"
                  className={errors.image ? "border-red-500" : ""}
                />
                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                <p className="text-xs text-gray-500">
                  Enter a URL for the car image. You can use image hosting services like Imgur or Cloudinary.
                </p>
              </div>
            )}
          </div>

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

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-primary-light hover:bg-primary-dark text-white" disabled={isSubmitting}>
              {isSubmitting ? "Updating Car..." : "Update Car"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

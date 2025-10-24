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
import ServiceFeeCalculator from "./service-fee-calculator"
import type { FeeCalculationResult } from "@/lib/fee-calculator"

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
    vatRate: "5", // Default VAT rate
    currency: "EUR", // Default to EUR
    image: "",
    description: "",
    features: [] as string[],
    // Additional car details
    transmission: "",
    color: "",
    availability: "Available",
    fuel_type: "",
    gearbox: "",
    mileage: "",
    car_type: "",
    horsepower: "",
    engine_size: "",
    drivetrain: "",
    chassis_number: "",
    location: "",
    seats: "",
    certificate_of_conformity: "",
    service_book: "",
    ref_no: "",
    emission_class: "",
    first_registration: "",
    crash_history: "",
    availability_type: "available_now",
    availability_days: 12,
    availability_date: "",
    // Seller information
    seller_type: "individual" as "individual" | "dealership",
    dealership_name: "",
    // New pricing and admin features
    is_netto_price: false,
    is_new_car: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [customFeature, setCustomFeature] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Service fee states
  const [isFeePaid, setIsFeePaid] = useState(false)
  const [feeCalculation, setFeeCalculation] = useState<FeeCalculationResult | null>(null)
  const [showFeeCalculator, setShowFeeCalculator] = useState(false)

  const { user } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) return
      
      try {
        const { data } = await supabaseClient
          .from('users')
          .select('role, email')
          .eq('id', user.id)
          .single()
        
        if (data && (data.role === 'admin' || data.role === 'super_admin' || data.email === 'mohammedlk27@gmail.com')) {
          setIsAdmin(true)
          // Auto-set fee as paid for admins
          setIsFeePaid(true)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
      }
    }
    
    checkAdminStatus()
  }, [user])

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

    // Validate service fee payment (only if not netto pricing and not admin)
    if (!formData.is_netto_price && !isFeePaid && !isAdmin) {
      newErrors.feePayment = "Service fee must be paid before publishing the car ad"
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

    // Auto-detect image type and switch upload method if needed
    if (name === 'image' && value.trim()) {
      if (value.startsWith('data:image/')) {
        // If it's a base64 image, switch to file upload method
        setUploadMethod('file')
        // Clear any image errors
        if (errors.image) {
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.image
            return newErrors
          })
        }
      } else if (value.startsWith('http://') || value.startsWith('https://')) {
        // If it's a regular URL, switch to URL method
        setUploadMethod('url')
        // Clear any image errors
        if (errors.image) {
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.image
            return newErrors
          })
        }
      }
    }

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
      
      const { priceWithVat, vatAmount } = calculatePrices(priceExclVat, vatRate)
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

    // Check if adding these files would exceed the 30 image limit
    if (selectedFiles.length + validFiles.length > 30) {
      setServerError(`Maximum 30 images allowed. You can add ${30 - selectedFiles.length} more images.`)
      return
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

  const setPrimaryImage = (index: number) => {
    if (index === 0) return // Already primary
    
    setSelectedFiles(prev => {
      const newFiles = [...prev]
      const primaryFile = newFiles[0]
      newFiles[0] = newFiles[index]
      newFiles[index] = primaryFile
      return newFiles
    })
    
    setPreviewUrls(prev => {
      const newUrls = [...prev]
      const primaryUrl = newUrls[0]
      newUrls[0] = newUrls[index]
      newUrls[index] = primaryUrl
      return newUrls
    })
  }

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev]
      const [movedFile] = newFiles.splice(fromIndex, 1)
      newFiles.splice(toIndex, 0, movedFile)
      return newFiles
    })
    
    setPreviewUrls(prev => {
      const newUrls = [...prev]
      const [movedUrl] = newUrls.splice(fromIndex, 1)
      newUrls.splice(toIndex, 0, movedUrl)
      return newUrls
    })
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
        availability: formData.availability_type,
        availability_days: formData.availability_type === 'available_soon' ? Number(formData.availability_days) : null,
        availability_date: formData.availability_type === 'available_date' ? formData.availability_date : null,
        // New pricing and admin features
        is_netto_price: formData.is_netto_price,
        is_new_car: formData.is_new_car,
        admin_fee_waived: isAdmin, // Mark as admin waived for admins
        fee_paid: formData.is_netto_price || isAdmin ? true : isFeePaid, // Skip fee payment for netto pricing or admins
        service_fee_amount: formData.is_netto_price || isAdmin ? 0 : (feeCalculation?.totalCustomerPays || 0),
        service_fee_currency: formData.currency,
        fee_model: formData.is_netto_price ? 'netto_pricing' : (isAdmin ? 'admin_waived' : (feeCalculation?.feeModel || 'vat_on_top')),
        is_published: true, // Auto-publish after successful submission
        published_at: new Date().toISOString(),
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

              {/* Availability Section */}
              <div className="space-y-2">
                <Label>Availability</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="available_now"
                      name="availability_type"
                      value="available_now"
                      checked={formData.availability_type === 'available_now'}
                      onChange={handleChange}
                      className="text-primary-light focus:ring-primary-light"
                    />
                    <Label htmlFor="available_now" className="cursor-pointer">Available Now</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="available_soon"
                      name="availability_type"
                      value="available_soon"
                      checked={formData.availability_type === 'available_soon'}
                      onChange={handleChange}
                      className="text-primary-light focus:ring-primary-light"
                    />
                    <Label htmlFor="available_soon" className="cursor-pointer">Available Soon</Label>
                  </div>
                  
                  {formData.availability_type === 'available_soon' && (
                    <div className="ml-6">
                      <Label htmlFor="availability_days">Days until available</Label>
                      <Input
                        id="availability_days"
                        name="availability_days"
                        type="number"
                        min="1"
                        value={formData.availability_days}
                        onChange={handleChange}
                        placeholder="e.g. 12"
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="available_date"
                      name="availability_type"
                      value="available_date"
                      checked={formData.availability_type === 'available_date'}
                      onChange={handleChange}
                      className="text-primary-light focus:ring-primary-light"
                    />
                    <Label htmlFor="available_date" className="cursor-pointer">Available from specific date</Label>
                  </div>
                  
                  {formData.availability_type === 'available_date' && (
                    <div className="ml-6">
                      <Label htmlFor="availability_date">Available from date</Label>
                      <Input
                        id="availability_date"
                        name="availability_date"
                        type="date"
                        value={formData.availability_date}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
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

          {/* Pricing Section */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">
              {formData.is_netto_price ? "Netto Price Information" : "Pricing Information"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="priceExclVat">
                  {formData.is_netto_price ? "Netto Price" : "Price (excl. VAT)"}
                </Label>
                <div className="flex gap-2">
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="AED">AED</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <Input
                    id="priceExclVat"
                    name="priceExclVat"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.priceExclVat}
                    onChange={handleChange}
                    placeholder="e.g. 257240"
                    className={`flex-1 ${errors.priceExclVat ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.priceExclVat && <p className="text-red-500 text-sm">{errors.priceExclVat}</p>}
                {formData.is_netto_price ? (
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    ℹ️ This is your netto price. No service fee will be calculated on this amount.
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Enter the price excluding VAT (e.g., 257240 for €257,240)</p>
                )}
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
                <Label>
                  {formData.is_netto_price ? "Netto Price Summary" : "Price Summary"}
                </Label>
                <div className="bg-white p-3 border rounded-md space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{formData.is_netto_price ? "Netto Price:" : "Price (excl. VAT):"}</span>
                    <span>{formData.priceExclVat ? `${formData.currency} ${formData.priceExclVat}` : '-'}</span>
                  </div>
                  {!formData.is_netto_price && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>VAT ({formData.vatRate}%):</span>
                        <span>{vatAmount ? `${formData.currency} ${vatAmount}` : '-'}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total (incl. VAT):</span>
                        <span>{priceWithVat ? `${formData.currency} ${priceWithVat}` : '-'}</span>
                      </div>
                    </>
                  )}
                  {formData.is_netto_price && (
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
                      ✓ No service fee will be charged on this netto price
                    </div>
                  )}
                </div>
              </div>
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

          {/* Service Fee Section - Only show if not netto pricing */}
          {!formData.is_netto_price && (
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    Service Fee Payment
                    {isFeePaid && <span className="h-5 w-5 text-green-600">✔️</span>}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isFeePaid 
                      ? "Service fee paid! Your car ad is ready to publish." 
                      : "A service fee is required to publish your car ad"
                    }
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFeeCalculator(!showFeeCalculator)}
                  className="flex items-center gap-2"
                >
                  {showFeeCalculator ? 'Hide Calculator' : 'Show Calculator'}
                </Button>
              </div>
              
              {showFeeCalculator && (
                <ServiceFeeCalculator
                  onFeePaid={setIsFeePaid}
                  onFeeCalculated={setFeeCalculation}
                  initialPrice={formData.priceExclVat ? parseFloat(formData.priceExclVat) : 0}
                  initialCurrency={formData.currency}
                  initialVatRate={formData.vatRate ? parseFloat(formData.vatRate) : 25}
                />
              )}
              
              {errors.feePayment && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.feePayment}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Admin Notice */}
          {isAdmin && (
            <div className="space-y-4 p-4 border rounded-lg bg-purple-50">
              <div className="flex items-center gap-2 text-purple-700">
                <Check className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Admin Privileges Active</h3>
              </div>
              <p className="text-sm text-purple-600">
                You are logged in as an administrator. Service fees are automatically waived for you. 
                You can publish cars directly without payment.
              </p>
            </div>
          )}

          {/* Netto Pricing Info */}
          {formData.is_netto_price && (
            <div className="space-y-4 p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Netto Pricing Selected</h3>
              </div>
              <p className="text-sm text-green-600">
                You have selected netto pricing. No service fee calculation is required. 
                Your car will be published with the netto price as displayed.
              </p>
            </div>
          )}

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
                      PNG, JPG, GIF up to 10MB (Max 30 images)
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
                      <span className="text-sm font-medium">
                        Selected Images ({previewUrls.length}/30)
                      </span>
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
                          <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Drag and drop images to reorder. The first image will be the primary image.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  id="image"
                  name="image"
                  type="text"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter image URL or paste base64 image data"
                  className={`${errors.image ? "border-red-500" : ""} ${formData.image && (formData.image.startsWith('http') || formData.image.startsWith('data:image/')) ? "border-green-500" : ""}`}
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded-lg border"
                      onError={() => {
                        // Only show error if it's not a base64 image
                        if (!formData.image.startsWith('data:image/')) {
                          setErrors(prev => ({ ...prev, image: "Invalid image URL" }))
                        }
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  You can enter a URL (starting with http:// or https://) or paste base64 image data
                </p>
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
              disabled={isSubmitting || (!formData.is_netto_price && !isFeePaid && !isAdmin)}
            >
              {isSubmitting 
                ? "Adding Car..." 
                : isAdmin
                  ? "Publish Car Ad (Admin)"
                  : formData.is_netto_price 
                    ? "Publish Car Ad (Netto Pricing)" 
                    : isFeePaid 
                      ? "Publish Car Ad" 
                      : "Pay Fee to Publish"
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}



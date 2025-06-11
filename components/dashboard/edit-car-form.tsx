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
import { AlertCircle, ArrowLeft, Upload, X, Camera, ExternalLink, Plus } from "lucide-react"
import Link from "next/link"

interface EditCarFormProps {
  car: any
}

export default function EditCarForm({ car }: EditCarFormProps) {
  const [formData, setFormData] = useState({
    name: car.name || "",
    brand: car.brand || "",
    category: car.category || "",
    year: car.year || new Date().getFullYear(),
    price: car.price || "",
    currency: car.currency || "USD",
    image: car.image || "",
    description: car.description || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
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

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: `${file.name} is too large (max 5MB)` }))
        continue
      }

      validFiles.push(file)
    }

    // Check total files limit (max 10 images)
    const totalFiles = previewUrls.length + validFiles.length
    if (totalFiles > 10) {
      setErrors((prev) => ({ ...prev, image: 'Maximum 10 images allowed' }))
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
              <Label htmlFor="price">Price</Label>
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
            </div>
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
                          <div key={index} className="relative group">
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
                            {existingImages.includes(url) && (
                              <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                Saved
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-green-600 font-medium">
                          ✓ {previewUrls.length} image{previewUrls.length !== 1 ? 's' : ''} total
                          {selectedFiles.length > 0 && ` (${selectedFiles.length} new)`}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1"
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
                          Supports: JPG, PNG, GIF, WebP (max 5MB each, 10 images max)
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

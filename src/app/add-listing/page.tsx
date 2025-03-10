'use client'

import React, { useState } from 'react'
import { Camera, DollarSign, Info, X } from 'lucide-react'

interface ListingForm {
  title: string
  make: string
  model: string
  year: string
  mileage: string
  price: string
  description: string
  condition: string
  transmission: string
  fuelType: string
  bodyStyle: string
  color: string
  location: string
}

const AddListingPage = () => {
  const [form, setForm] = useState<ListingForm>({
    title: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    description: '',
    condition: '',
    transmission: '',
    fuelType: '',
    bodyStyle: '',
    color: '',
    location: ''
  })

  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 10) {
      alert('Maximum 10 images allowed')
      return
    }

    setImages([...images, ...files])
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls([...previewUrls, ...newPreviewUrls])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviewUrls(newPreviewUrls)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data and images to your backend
    console.log('Form data:', form)
    console.log('Images:', images)
    alert('Listing submitted successfully!')
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g. 2023 BMW M3 Competition"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Make</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g. BMW"
                  value={form.make}
                  onChange={(e) => setForm({ ...form, make: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g. M3"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="e.g. 2023"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Condition</label>
                <select
                  className="input w-full"
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  required
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mileage</label>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="e.g. 15000"
                  value={form.mileage}
                  onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Transmission</label>
                <select
                  className="input w-full"
                  value={form.transmission}
                  onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                  required
                >
                  <option value="">Select transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fuel Type</label>
                <select
                  className="input w-full"
                  value={form.fuelType}
                  onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                  required
                >
                  <option value="">Select fuel type</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Body Style</label>
                <select
                  className="input w-full"
                  value={form.bodyStyle}
                  onChange={(e) => setForm({ ...form, bodyStyle: e.target.value })}
                  required
                >
                  <option value="">Select body style</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Wagon">Wagon</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Black"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Price and Location */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Price and Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    className="input w-full pl-10"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Los Angeles, CA"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <textarea
              className="input w-full h-32"
              placeholder="Describe your vehicle's condition, features, and history"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          {/* Photos */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="images"
              />
              <label htmlFor="images" className="cursor-pointer">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop photos here, or click to select files
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Maximum 10 photos, each up to 5MB
                </p>
              </label>
            </div>

            {/* Image previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              Submit Listing
            </button>
            <button type="button" className="btn-secondary">
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddListingPage 
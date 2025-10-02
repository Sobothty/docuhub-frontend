"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"
import Image from "next/image"

interface FormData {
  fullName: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  fullName?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactPag() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSubmitted(true)
      setFormData({ fullName: "", email: "", subject: "", message: "" })
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-6">Thank you for reaching out. We will get back to you within 24 hours.</p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Send Another Message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
         <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have a question, suggestion, or need assistance? Fill out the form below and our team will get back to you
              promptly.
            </p>
          </div>
      {/* Left side - Contact Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="text-section-headings text-center mb-2">Contact Form Fields:</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block  text-subheadings mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Andrew Garfield"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-subheadings mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="andrew@docuhub.net"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="block text-subheadings mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Type here!"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.subject && <p className="text-sm text-red-600 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Type here!"
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Professional Image */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/contactUs/inputFormPic.png"
          alt="Professional woman working on laptop in modern office"
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

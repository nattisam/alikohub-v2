"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, Lock } from "lucide-react"
import { useAuth } from "../../context/auth-context"
import { useNavigate } from "react-router-dom"

interface ApplicationFormProps {
  job: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function ApplicationForm({ job, onSubmit, onCancel }: ApplicationFormProps) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : "",
    email: user?.email || "",
    phone: "",
    resume: null as File | null,
    coverLetter: "",
    experience: "",
    skills: "",
  })

  // If user is not authenticated or doesn't have USER role, redirect to login
  if (!isAuthenticated || user?.role !== 'USER') {
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full">
        <div className="w-full max-w-2xl mx-auto bg-white border border-border rounded-xl p-8 shadow-sm text-center">
          <Lock className="w-12 h-12 text-[#1175BD] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1C1800] mb-2">Login Required</h2>
          <p className="text-[#1C1800]/70 mb-6">
            You must be logged in to apply for this job.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-gradient-to-r from-[#1175BD] to-[#38A1FF] text-white rounded-full hover:shadow-lg transition-all font-semibold"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 border border-border text-[#1C1800] rounded-full hover:bg-[#F5F8F3] transition-all font-medium"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmit(formData)
    }, 1500)
  }

  return (
    <div className="p-0 md:p-6 lg:p-8 w-full max-w-full">
      <div className="w-full">
        {/* Back Button */}
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-[#1175BD] hover:text-[#38A1FF] transition-colors mb-8 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Job Search
        </button>

        {/* Job Info */}
        <div className="bg-white border border-border rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1C1800] mb-2">{job.title}</h2>
          <p className="text-[#1C1800]/70">
            {job.company} • {job.location}
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-[#1C1800] mb-6">Apply Now</h3>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#1C1800] mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C1800] mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1C1800] mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1C1800] mb-2">Resume/CV *</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-[#1175BD] transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-input"
                required
              />
              <label htmlFor="resume-input" className="cursor-pointer">
                <p className="text-[#1C1800] font-medium mb-1">
                  {formData.resume ? formData.resume.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-[#1C1800]/60 text-sm">PDF, DOC, DOCX (Max 5MB)</p>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1C1800] mb-2">Cover Letter</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Tell us why you're interested in this position..."
              rows={4}
              className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-[#1C1800] mb-2">Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="5"
                className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C1800] mb-2">Key Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, TypeScript..."
                className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-[#1C1800] rounded-full hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-border text-[#1C1800] rounded-full hover:bg-[#F5F8F3] transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

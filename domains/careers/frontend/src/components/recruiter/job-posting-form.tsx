"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

interface JobPostingFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function JobPostingForm({ onSubmit, onCancel, isSubmitting = false }: JobPostingFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salaryRange: "",
    location: "",
    type: "FULL_TIME",
    status: "OPEN",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.description) {
      // Prepare the job data in the required format
      const jobData = {
        ...formData,
        status: "OPEN", // Always set status to OPEN for new jobs
      };
      onSubmit(jobData)
      setFormData({
        title: "",
        description: "",
        requirements: "",
        salaryRange: "",
        location: "",
        type: "FULL_TIME",
        status: "OPEN",
      })
    }
  }

  return (
    <div className="ring-1 ring-black/5 shadow-sm backdrop-blur-sm rounded-xl bg-white/90 p-6">
      <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#1C1800]">Create New Job Posting</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-[#1C1800]/70 hover:text-[#1C1800] transition-colors"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1C1800] mb-2">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior React Developer"
            className="w-full px-4 py-3 bg-white ring-1 ring-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1800] mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Remote, On-site, Hybrid"
            className="w-full px-4 py-3 bg-white ring-1 ring-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#1C1800] mb-2">Job Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the job role and responsibilities"
          rows={4}
          className="w-full px-4 py-3 bg-white ring-1 ring-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD] resize-none"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#1C1800] mb-2">Requirements</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="List required skills and qualifications"
          rows={3}
          className="w-full px-4 py-3 bg-white ring-1 ring-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD] resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1C1800] mb-2">Salary Range</label>
          <input
            type="text"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            placeholder="e.g. $100k - $120k"
            className="w-full px-4 py-3 bg-white ring-1 ring-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1800] mb-2">Job Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white ring-1 ring-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
            disabled={isSubmitting}
          >
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERN">Internship</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-[#1C1800] rounded-full hover:shadow-lg transition-all font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Publishing..."
          ) : (
            "Publish Job Posting"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 ring-1 ring-border text-[#1C1800] rounded-full hover:bg-[#F5F8F3] transition-all font-medium"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
    </div>
  )
}

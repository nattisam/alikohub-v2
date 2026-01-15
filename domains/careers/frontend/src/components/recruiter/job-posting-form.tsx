"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

interface JobPostingFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function JobPostingForm({ onSubmit, onCancel }: JobPostingFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    department: "Engineering",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.description) {
      onSubmit(formData)
      setFormData({
        title: "",
        department: "Engineering",
        description: "",
        requirements: "",
        salaryMin: "",
        salaryMax: "",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#1C1800]">Create New Job Posting</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-[#1C1800]/70 hover:text-[#1C1800] transition-colors"
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
            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1800] mb-2">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
          >
            <option>Engineering</option>
            <option>Product</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>Sales</option>
          </select>
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
          className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD] resize-none"
          required
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
          className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1C1800] mb-2">Salary Min (USD)</label>
          <input
            type="number"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={handleChange}
            placeholder="100000"
            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1800] mb-2">Salary Max (USD)</label>
          <input
            type="number"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={handleChange}
            placeholder="150000"
            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-[#1C1800] focus:outline-none focus:ring-2 focus:ring-[#1175BD] focus:border-[#1175BD]"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-[#1C1800] rounded-full hover:shadow-lg transition-all font-semibold"
        >
          Publish Job Posting
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
  )
}

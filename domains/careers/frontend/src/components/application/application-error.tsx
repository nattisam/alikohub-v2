"use client"
import { AlertCircle, ChevronLeft } from "lucide-react"

interface ApplicationErrorProps {
  jobTitle?: string
  onRetry: () => void
  onCancel: () => void
}

export function ApplicationError({ jobTitle, onRetry, onCancel }: ApplicationErrorProps) {
  return (
    <div className="p-0 md:p-6 lg:p-8 w-full max-w-full flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#1C1800] mb-3">Application Failed</h1>

        <p className="text-[#1C1800]/70 mb-2">
          We encountered an error while submitting your application for{" "}
          <span className="text-[#1175BD] font-semibold">{jobTitle}</span>.
        </p>

        <p className="text-[#1C1800]/70 mb-8">
          Please check your information and try again. If the problem persists, contact our support team.
        </p>

        <div className="bg-white border border-red-300 rounded-xl p-6 mb-8 text-left shadow-sm">
          <p className="text-sm font-medium text-[#1C1800] mb-3">Common Issues:</p>
          <ul className="text-sm text-[#1C1800]/70 space-y-2">
            <li>• File upload failed - try a different file format</li>
            <li>• Network connection issue - check your internet</li>
            <li>• Form validation error - review all required fields</li>
            <li>• Server error - please try again in a few moments</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-[#1175BD] to-[#38A1FF] text-white rounded-full hover:shadow-lg transition-all font-semibold"
          >
            Retry Application
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-border text-[#1C1800] rounded-full hover:bg-[#F5F8F3] transition-all font-medium flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Search
          </button>
        </div>
      </div>
    </div>
  )
}

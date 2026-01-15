"use client"
import { CheckCircle, Mail } from "lucide-react"

interface ApplicationSuccessProps {
  jobTitle?: string
  onApplyAgain: () => void
}

export function ApplicationSuccess({ jobTitle, onApplyAgain }: ApplicationSuccessProps) {
  return (
    <div className="p-0 md:p-6 lg:p-8 w-full max-w-full flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#1175BD] to-[#38A1FF] rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#1C1800] mb-3">Application Submitted!</h1>

        <p className="text-[#1C1800]/70 mb-2">
          Your application for <span className="text-[#1175BD] font-semibold">{jobTitle}</span> has been successfully
          submitted.
        </p>

        <p className="text-[#1C1800]/70 mb-8">
          We'll review your application and get back to you shortly. Keep an eye on your email for updates.
        </p>

        <div className="bg-white border border-border rounded-xl p-6 mb-8 text-left shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-[#1175BD]" />
            <p className="text-sm font-medium text-[#1C1800]">What's Next?</p>
          </div>
          <ul className="text-sm text-[#1C1800]/70 space-y-2">
            <li>✓ Your application has been received</li>
            <li>✓ We'll review your qualifications</li>
            <li>✓ Check your email for interview updates</li>
            <li>✓ Expected timeline: 1-2 weeks</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onApplyAgain}
            className="px-6 py-3 bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-[#1C1800] rounded-full hover:shadow-lg transition-all font-semibold"
          >
            Explore More Jobs
          </button>
          <button className="px-6 py-3 border border-border text-[#1C1800] rounded-full hover:bg-[#F5F8F3] transition-all font-medium">
            Download Application
          </button>
        </div>
      </div>
    </div>
  )
}

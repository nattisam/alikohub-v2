"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import SignupForm from '../../../../../libraries/ui-libraries/components/auth/SignupForm'
import type { SignupFormData } from '../../../../../libraries/ui-libraries/components/auth/SignupForm'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignup = async (data: SignupFormData) => {
    setError(null)
    setIsSubmitting(true)
    try {
      await register({ 
        firstname: data.firstName, 
        lastname: data.lastName, 
        email: data.email, 
        password: data.password, 
        captchaToken: data.captchaToken || '' 
      })
      navigate("/", { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSwitchToLogin = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
      

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <SignupForm 
          onSubmit={handleSignup} 
          onSwitchToLogin={handleSwitchToLogin}
          loading={isSubmitting}
          recaptchaSiteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        />
      </div>
    </div>
  )
}



"use client";

import type React from "react";
import { useState } from "react";
import { ChevronLeft, Lock } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";

interface ApplicationFormProps {
  job: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ApplicationForm({
  job,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  // If user is not authenticated or doesn't have global USER role, redirect to login
  if (
    !isAuthenticated ||
    (user?.globalRole !== "USER" && user?.globalRole !== "ADMIN")
  ) {
    return (
      <div className="w-full min-h-screen bg-stone-50">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-10 shadow-sm text-center hover:shadow-md transition-shadow duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-6">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Login Required
            </h2>
            <p className="text-gray-500 mb-8">
              You must be logged in to apply for this job.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all font-semibold"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload a resume");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("coverLetter", coverLetter);

    // Simulate network delay for better UX
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(formData);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-stone-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="w-full">
          {/* Back Button */}
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2.5 rounded-full bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 shadow-sm hover:shadow-md mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Job Search
          </button>

          {/* Job Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {job.title}
            </h2>
            <p className="text-lg text-gray-600">
              <span className="font-semibold text-indigo-600">
                {job.company}
              </span>{" "}
              • {job.location}
            </p>
          </div>

          {/* Application Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply Now</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume (PDF, DOCX) *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  required
                />
              </div>
              {resumeFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {resumeFile.name}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter
              </label>
              <textarea
                name="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're interested in this position..."
                rows={5}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors duration-300"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

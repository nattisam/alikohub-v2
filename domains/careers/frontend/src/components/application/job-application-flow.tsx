"use client"

import { useState } from "react"
import { JobSearch } from "./job-search"
import { ApplicationForm } from "./application-form"
import { ApplicationSuccess } from "./application-success"
import { ApplicationError } from "./application-error"

type ApplicationStep = "search" | "form" | "success" | "error"

export function JobApplicationFlow() {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>("search")
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [applicationData, setApplicationData] = useState<any>(null)

  const handleSelectJob = (job: any) => {
    setSelectedJob(job)
    setCurrentStep("form")
  }

  const handleSubmitApplication = (data: any) => {
    setApplicationData(data)
    // Simulate random success/error for demo
    const isSuccess = Math.random() > 0.2
    setCurrentStep(isSuccess ? "success" : "error")
  }

  const handleStartOver = () => {
    setCurrentStep("search")
    setSelectedJob(null)
    setApplicationData(null)
  }

  switch (currentStep) {
    case "search":
      return <JobSearch onSelectJob={handleSelectJob} />
    case "form":
      return <ApplicationForm job={selectedJob} onSubmit={handleSubmitApplication} onCancel={handleStartOver} />
    case "success":
      return <ApplicationSuccess jobTitle={selectedJob?.title} onApplyAgain={handleStartOver} />
    case "error":
      return (
        <ApplicationError
          jobTitle={selectedJob?.title}
          onRetry={() => setCurrentStep("form")}
          onCancel={handleStartOver}
        />
      )
  }
}

"use client"

import type React from "react"
import { createContext, useState } from "react"

interface ApplicationContextType {
  applications: any[]
  addApplication: (app: any) => void
  updateApplicationStatus: (id: string, status: string) => void
}

export const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined)

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<any[]>([])

  const addApplication = (app: any) => {
    setApplications([...applications, { ...app, id: Date.now() }])
  }

  const updateApplicationStatus = (id: string, status: string) => {
    setApplications(applications.map((app) => (app.id === id ? { ...app, status } : app)))
  }

  return (
    <ApplicationContext.Provider value={{ applications, addApplication, updateApplicationStatus }}>
      {children}
    </ApplicationContext.Provider>
  )
}

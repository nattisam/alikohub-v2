import React, { createContext, useContext, useState } from "react";

interface StateConfig {
  name: string;
  contact: {
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    admissionsPhone: string;
    admissionsEmail: string;
  };
  officeHours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  regulatory: {
    department: string;
    departmentAbbr: string;
    certifications: string[];
  };
}

const defaultState: StateConfig = {
  name: "Washington",
  contact: {
    address: "123 Healthcare Way, Suite 100",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    phone: "(206) 555-0123",
    email: "health@alikoacademy.com",
    admissionsPhone: "(206) 555-0124",
    admissionsEmail: "admissions.health@alikoacademy.com",
  },
  officeHours: {
    weekday: "Mon - Fri: 8:00 AM - 6:00 PM",
    saturday: "Sat: 9:00 AM - 1:00 PM",
    sunday: "Sun: Closed",
  },
  regulatory: {
    department: "Washington State Department of Health",
    departmentAbbr: "WA DOH",
    certifications: [
      "Nursing Assistant Certified (NAC)",
      "Medical Assistant Certified (MA-C)",
      "Phlebotomy Technician Certification",
      "Medical Billing & Coding Specialist",
      "EKG Technician Certification",
      "Patient Care Technician Certification",
      "Medication Aide Certification",
      "Home Care Aide Certification",
    ],
  },
};

interface StateContextType {
  currentState: StateConfig;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentState] = useState<StateConfig>(defaultState);

  return (
    <StateContext.Provider value={{ currentState }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateConfig = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    // Return default state even if context is missing to prevent crashes
    return { currentState: defaultState };
  }
  return context;
};

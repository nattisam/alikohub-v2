// Engineering Licensure & Professional Certifications Data

export interface Certification {
  id: string;
  name: string;
  shortName: string;
  administeredBy: string;
  description: string;
  whoItsFor: string[];
  domains?: string[];
  outcome: string;
  notes?: string;
}

export interface CertificationCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  certifications: Certification[];
}

// Core Engineering Licensure Exams
export const coreLicensureExams: CertificationCategory = {
  id: "core-licensure",
  title: "Core Engineering Licensure Exams",
  description: "Foundational licensure exams that apply across most engineering disciplines in the U.S. and many other countries.",
  icon: "Shield",
  accentColor: "primary",
  certifications: [
    {
      id: "fe",
      name: "Fundamentals of Engineering Exam",
      shortName: "FE",
      administeredBy: "NCEES (U.S.)",
      description: "The first step toward professional engineering licensure in the United States.",
      whoItsFor: [
        "Final-year engineering students",
        "Recent graduates",
        "Entry-level engineers"
      ],
      domains: [
        "Civil",
        "Mechanical",
        "Electrical & Computer",
        "Chemical",
        "Industrial & Systems",
        "Environmental",
        "Other disciplines"
      ],
      outcome: "Earns EIT / EI (Engineer-in-Training) status — Step 1 toward PE licensure"
    },
    {
      id: "pe",
      name: "Principles and Practice of Engineering Exam",
      shortName: "PE",
      administeredBy: "NCEES (U.S.)",
      description: "The licensure exam that grants legal authority to practice engineering independently.",
      whoItsFor: [
        "Engineers with FE passed",
        "Engineers with required experience (typically 4+ years)"
      ],
      domains: [
        "Civil (Structural, Transportation, Water, Construction, Geotechnical)",
        "Mechanical (HVAC, Thermal & Fluids, Machine Design)",
        "Electrical & Computer (Power, Electronics, Controls)",
        "Environmental",
        "Industrial",
        "Chemical"
      ],
      outcome: "Professional Engineer (PE) license — Legal authority to sign/seal engineering documents"
    },
    {
      id: "se",
      name: "Structural Engineering Exam",
      shortName: "SE",
      administeredBy: "NCEES (U.S., select states)",
      description: "Advanced licensure for structural engineers working on major structures.",
      whoItsFor: [
        "Advanced structural engineers",
        "Engineers specializing in seismic/wind design"
      ],
      domains: [
        "Vertical structures",
        "Lateral forces (seismic & wind)"
      ],
      outcome: "Structural Engineer (SE) license — Required in some states for major structures"
    }
  ]
};

// Domain-Specific Certifications
export const domainCertifications: CertificationCategory[] = [
  {
    id: "civil-structural",
    title: "Civil & Structural Engineering",
    description: "Professional certifications for civil and structural engineering professionals.",
    icon: "Building2",
    accentColor: "accent-green",
    certifications: [
      {
        id: "pmp",
        name: "Project Management Professional",
        shortName: "PMP®",
        administeredBy: "PMI",
        description: "Industry-standard project management certification.",
        whoItsFor: ["Project managers", "Construction managers", "Engineering leads"],
        outcome: "Recognized credential for project management excellence"
      },
      {
        id: "ccm",
        name: "Certified Construction Manager",
        shortName: "CMIT / CCM",
        administeredBy: "CMAA",
        description: "Professional credential for construction management.",
        whoItsFor: ["Construction managers", "Project engineers"],
        outcome: "Demonstrates construction management competency"
      },
      {
        id: "envsp",
        name: "Envision Sustainability Professional",
        shortName: "ENV SP",
        administeredBy: "ISI",
        description: "Sustainability credential for infrastructure projects.",
        whoItsFor: ["Civil engineers", "Environmental planners"],
        outcome: "Credential in sustainable infrastructure"
      },
      {
        id: "autodesk-civil",
        name: "Autodesk Certified Professional",
        shortName: "ACP",
        administeredBy: "Autodesk",
        description: "Tool-based certification for AutoCAD, Revit, and Civil 3D.",
        whoItsFor: ["CAD technicians", "Design engineers", "BIM specialists"],
        outcome: "Validates proficiency in Autodesk tools",
        notes: "Tool-based certification, not licensure"
      },
      {
        id: "bentley",
        name: "Bentley Certifications",
        shortName: "Bentley",
        administeredBy: "Bentley Systems",
        description: "Certifications for MicroStation, OpenRoads, and related software.",
        whoItsFor: ["Infrastructure designers", "Highway engineers"],
        outcome: "Demonstrates Bentley software proficiency",
        notes: "Tool-based certification, not licensure"
      },
      {
        id: "csi",
        name: "CSI Training Certificates",
        shortName: "CSI",
        administeredBy: "CSI (Training aligned)",
        description: "Training certificates for ETABS, SAP2000, and structural analysis software.",
        whoItsFor: ["Structural engineers", "Structural analysts"],
        outcome: "Training completion credential"
      }
    ]
  },
  {
    id: "mechanical",
    title: "Mechanical Engineering",
    description: "Professional certifications for mechanical engineering professionals.",
    icon: "Cog",
    accentColor: "accent-green",
    certifications: [
      {
        id: "cswp",
        name: "SOLIDWORKS Certification",
        shortName: "CSWP / CSWA",
        administeredBy: "Dassault Systèmes",
        description: "Professional and Associate certifications for SOLIDWORKS.",
        whoItsFor: ["Mechanical designers", "Product engineers", "CAD specialists"],
        outcome: "Validates SOLIDWORKS proficiency"
      },
      {
        id: "ansys",
        name: "ANSYS Certification Program",
        shortName: "ANSYS",
        administeredBy: "ANSYS Inc.",
        description: "Certification for simulation and analysis software.",
        whoItsFor: ["Simulation engineers", "FEA analysts"],
        outcome: "Demonstrates simulation competency"
      },
      {
        id: "asme",
        name: "ASME Certifications",
        shortName: "ASME",
        administeredBy: "ASME",
        description: "Certifications related to codes, standards, and mechanical engineering practices.",
        whoItsFor: ["Mechanical engineers", "Pressure vessel designers"],
        outcome: "Credential in ASME codes and standards"
      },
      {
        id: "hvac-excellence",
        name: "HVAC Excellence Certifications",
        shortName: "HVAC Excellence",
        administeredBy: "HVAC Excellence",
        description: "Industry certifications for HVAC professionals.",
        whoItsFor: ["HVAC engineers", "HVAC technicians"],
        outcome: "HVAC industry recognition"
      },
      {
        id: "six-sigma",
        name: "Six Sigma Certification",
        shortName: "Six Sigma",
        administeredBy: "ASQ / Various",
        description: "Quality management and process improvement certification.",
        whoItsFor: ["Manufacturing engineers", "Quality engineers", "Process engineers"],
        outcome: "Green Belt / Black Belt credential"
      }
    ]
  },
  {
    id: "electrical-power",
    title: "Electrical & Power Engineering",
    description: "Professional certifications for electrical and power systems engineers.",
    icon: "Zap",
    accentColor: "electrical",
    certifications: [
      {
        id: "pe-electrical",
        name: "PE – Electrical (Power)",
        shortName: "PE Electrical",
        administeredBy: "NCEES",
        description: "Professional licensure for electrical power engineers.",
        whoItsFor: ["Power systems engineers", "Electrical design engineers"],
        outcome: "Professional Engineer license in Electrical"
      },
      {
        id: "nicet",
        name: "NICET Certification",
        shortName: "NICET",
        administeredBy: "NICET",
        description: "Certification for electrical engineering technicians.",
        whoItsFor: ["Electrical technicians", "Fire alarm designers"],
        outcome: "Engineering technology credential"
      },
      {
        id: "etap",
        name: "ETAP Certification",
        shortName: "ETAP",
        administeredBy: "ETAP",
        description: "Certification for power systems analysis software.",
        whoItsFor: ["Power systems engineers", "Electrical analysts"],
        outcome: "Validates ETAP software proficiency"
      },
      {
        id: "digsilent",
        name: "DIgSILENT Training Certificates",
        shortName: "DIgSILENT",
        administeredBy: "DIgSILENT",
        description: "Training certificates for PowerFactory and related tools.",
        whoItsFor: ["Power systems planners", "Grid analysts"],
        outcome: "Training completion credential"
      },
      {
        id: "isa-cap",
        name: "Certified Automation Professional",
        shortName: "ISA CAP",
        administeredBy: "ISA",
        description: "Certification for automation and control systems professionals.",
        whoItsFor: ["Automation engineers", "Control systems engineers"],
        outcome: "ISA Certified Automation Professional"
      }
    ]
  },
  {
    id: "architectural-bim",
    title: "Architectural / BIM / Construction Technology",
    description: "Professional certifications for architecture, BIM, and construction technology.",
    icon: "Building",
    accentColor: "primary",
    certifications: [
      {
        id: "autodesk-acp",
        name: "Autodesk Certified Professional",
        shortName: "ACP",
        administeredBy: "Autodesk",
        description: "Professional certification for Revit, AutoCAD, and other Autodesk products.",
        whoItsFor: ["BIM specialists", "Architects", "Design technologists"],
        outcome: "Validates Autodesk software proficiency"
      },
      {
        id: "archicad",
        name: "Graphisoft Archicad Certification",
        shortName: "Archicad",
        administeredBy: "Graphisoft",
        description: "Certification for Archicad BIM software.",
        whoItsFor: ["Architects", "BIM coordinators"],
        outcome: "Archicad proficiency credential"
      },
      {
        id: "openbim",
        name: "buildingSMART openBIM",
        shortName: "openBIM",
        administeredBy: "buildingSMART",
        description: "Certification for open BIM standards and interoperability.",
        whoItsFor: ["BIM managers", "BIM coordinators"],
        outcome: "openBIM credential"
      },
      {
        id: "leed",
        name: "LEED Green Associate / LEED AP",
        shortName: "LEED",
        administeredBy: "USGBC",
        description: "Sustainability and green building certification.",
        whoItsFor: ["Architects", "Sustainability consultants", "Project managers"],
        outcome: "LEED credential for sustainable design"
      },
      {
        id: "rics",
        name: "RICS Certification",
        shortName: "RICS",
        administeredBy: "RICS",
        description: "International credential for construction and real estate professionals.",
        whoItsFor: ["Quantity surveyors", "Construction managers"],
        outcome: "Chartered professional status (UK/International)"
      }
    ]
  },
  {
    id: "project-controls",
    title: "Project Controls & Construction Planning",
    description: "Professional certifications for project controls, scheduling, and construction planning.",
    icon: "ClipboardList",
    accentColor: "primary",
    certifications: [
      {
        id: "pmp-controls",
        name: "Project Management Professional",
        shortName: "PMP®",
        administeredBy: "PMI",
        description: "Industry-standard project management certification.",
        whoItsFor: ["Project managers", "Project controllers"],
        outcome: "PMP credential"
      },
      {
        id: "pmi-sp",
        name: "PMI Scheduling Professional",
        shortName: "PMI-SP",
        administeredBy: "PMI",
        description: "Specialized scheduling certification from PMI.",
        whoItsFor: ["Project schedulers", "Planning engineers"],
        outcome: "Scheduling professional credential"
      },
      {
        id: "primavera",
        name: "Primavera P6 Certification",
        shortName: "Primavera P6",
        administeredBy: "Oracle",
        description: "Certification for Oracle Primavera P6 scheduling software.",
        whoItsFor: ["Project planners", "Schedulers"],
        outcome: "Validates P6 proficiency"
      },
      {
        id: "aace",
        name: "AACE Certifications",
        shortName: "CCP / PSP / EVP",
        administeredBy: "AACE International",
        description: "Cost engineering, planning, and earned value certifications.",
        whoItsFor: ["Cost engineers", "Project controllers", "Planners"],
        outcome: "AACE professional credential"
      },
      {
        id: "prince2",
        name: "PRINCE2 Certification",
        shortName: "PRINCE2",
        administeredBy: "Axelos",
        description: "Project management methodology certification (UK/International).",
        whoItsFor: ["Project managers", "Program managers"],
        outcome: "PRINCE2 Practitioner credential"
      }
    ]
  }
];

// Aviation Domain Certifications
export const aviationCertifications: CertificationCategory[] = [
  {
    id: "faa",
    title: "FAA Certifications (United States)",
    description: "Aviation certifications administered by the Federal Aviation Administration.",
    icon: "Plane",
    accentColor: "accent",
    certifications: [
      {
        id: "ap",
        name: "Airframe & Powerplant",
        shortName: "A&P",
        administeredBy: "FAA",
        description: "The most common aviation technician license for aircraft maintenance and repair.",
        whoItsFor: ["Aviation maintenance technicians", "Aircraft mechanics"],
        outcome: "FAA A&P License — Authority to maintain and repair aircraft"
      },
      {
        id: "ia",
        name: "Inspection Authorization",
        shortName: "IA",
        administeredBy: "FAA",
        description: "Advanced authorization for A&P holders to perform inspections.",
        whoItsFor: ["Senior A&P mechanics", "Aviation inspectors"],
        outcome: "IA authorization for aircraft inspections"
      },
      {
        id: "pilot-certs",
        name: "FAA Pilot Certifications",
        shortName: "PPL / CPL / ATP",
        administeredBy: "FAA",
        description: "Pilot certifications from private to airline transport level.",
        whoItsFor: ["Student pilots", "Commercial pilots", "Airline pilots"],
        domains: [
          "PPL – Private Pilot License",
          "CPL – Commercial Pilot License",
          "ATP – Airline Transport Pilot"
        ],
        outcome: "FAA Pilot Certificate",
        notes: "Engineering-adjacent certifications"
      }
    ]
  },
  {
    id: "easa",
    title: "EASA Certifications (Europe & Global)",
    description: "Aviation certifications administered by the European Union Aviation Safety Agency.",
    icon: "Globe",
    accentColor: "accent",
    certifications: [
      {
        id: "part-66",
        name: "Part-66 Aircraft Maintenance License",
        shortName: "Part-66",
        administeredBy: "EASA",
        description: "European aircraft maintenance license with multiple categories.",
        whoItsFor: ["Aircraft maintenance engineers", "Aviation technicians"],
        domains: ["Category A", "Category B1", "Category B2", "Category C"],
        outcome: "EASA Part-66 License — Widely recognized internationally"
      }
    ]
  },
  {
    id: "aviation-engineering",
    title: "Aviation Engineering & Safety",
    description: "Specialized certifications for aviation engineering and safety management.",
    icon: "Shield",
    accentColor: "accent",
    certifications: [
      {
        id: "ame",
        name: "Aircraft Maintenance Engineer",
        shortName: "AME",
        administeredBy: "Transport Canada",
        description: "Canadian aircraft maintenance engineering license.",
        whoItsFor: ["Aircraft maintenance engineers (Canada)"],
        outcome: "AME License"
      },
      {
        id: "camo",
        name: "CAMO Training",
        shortName: "CAMO",
        administeredBy: "Various",
        description: "Continuing Airworthiness Management Organization training.",
        whoItsFor: ["Airworthiness managers", "Aviation compliance officers"],
        outcome: "CAMO competency"
      },
      {
        id: "sms",
        name: "Safety Management Systems",
        shortName: "SMS",
        administeredBy: "ICAO / Various",
        description: "Training in aviation safety management systems.",
        whoItsFor: ["Safety managers", "Aviation operations managers"],
        outcome: "SMS implementation competency"
      },
      {
        id: "icao",
        name: "ICAO Training Programs",
        shortName: "ICAO",
        administeredBy: "ICAO",
        description: "International Civil Aviation Organization training programs.",
        whoItsFor: ["Aviation professionals", "Regulators"],
        outcome: "ICAO training credentials"
      }
    ]
  }
];

// Get all certification categories
export const getAllCertificationCategories = (): CertificationCategory[] => {
  return [coreLicensureExams, ...domainCertifications];
};

// Get aviation certification categories
export const getAviationCategories = (): CertificationCategory[] => {
  return aviationCertifications;
};

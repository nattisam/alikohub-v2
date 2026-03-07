// CMS-like data structure for partners

export type PartnerCategory = 
  | "Academic & Institutional"
  | "Enterprise & Workforce"
  | "Technology Ecosystem";

export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  description?: string;
  website?: string;
  logoUrl?: string;
}

export const partners: Partner[] = [
  // Academic & Institutional Partners
  {
    id: "partner-1",
    name: "Regional Engineering Universities",
    category: "Academic & Institutional",
    description: "Collaboration with leading engineering faculties across the region."
  },
  {
    id: "partner-2",
    name: "Technical and Vocational Institutions",
    category: "Academic & Institutional",
    description: "Supporting TVET programs with industry-aligned curriculum."
  },
  {
    id: "partner-3",
    name: "Professional Engineering Societies",
    category: "Academic & Institutional",
    description: "Partnerships with engineering professional bodies."
  },
  // Enterprise & Workforce Partners
  {
    id: "partner-4",
    name: "Engineering & Construction Firms",
    category: "Enterprise & Workforce",
    description: "Workforce development for leading EPC contractors."
  },
  {
    id: "partner-5",
    name: "Infrastructure Development Agencies",
    category: "Enterprise & Workforce",
    description: "Supporting national infrastructure development initiatives."
  },
  {
    id: "partner-6",
    name: "Manufacturing Industries",
    category: "Enterprise & Workforce",
    description: "CAD/CAM/CAE training for manufacturing sectors."
  },
  // Technology Ecosystem
  {
    id: "partner-7",
    name: "Autodesk",
    category: "Technology Ecosystem",
    description: "Industry-standard BIM, CAD, and infrastructure software."
  },
  {
    id: "partner-8",
    name: "Bentley Systems",
    category: "Technology Ecosystem",
    description: "Infrastructure engineering software solutions."
  },
  {
    id: "partner-9",
    name: "Trimble",
    category: "Technology Ecosystem",
    description: "Construction technology and structural detailing."
  },
  {
    id: "partner-10",
    name: "Dassault Systèmes",
    category: "Technology Ecosystem",
    description: "SOLIDWORKS and 3D design solutions."
  },
  {
    id: "partner-11",
    name: "ANSYS",
    category: "Technology Ecosystem",
    description: "Engineering simulation and analysis software."
  },
  {
    id: "partner-12",
    name: "MathWorks",
    category: "Technology Ecosystem",
    description: "MATLAB and Simulink for engineering computation."
  },
  {
    id: "partner-13",
    name: "Esri",
    category: "Technology Ecosystem",
    description: "GIS and spatial analysis solutions."
  },
  {
    id: "partner-14",
    name: "Oracle",
    category: "Technology Ecosystem",
    description: "Primavera project management solutions."
  },
  {
    id: "partner-15",
    name: "Siemens",
    category: "Technology Ecosystem",
    description: "NX and industrial automation software."
  }
];

export const getPartnersByCategory = (category: PartnerCategory): Partner[] => {
  return partners.filter(p => p.category === category);
};

export const partnerCategories: PartnerCategory[] = [
  "Academic & Institutional",
  "Enterprise & Workforce",
  "Technology Ecosystem"
];
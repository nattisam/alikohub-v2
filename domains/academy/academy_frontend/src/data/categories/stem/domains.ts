// CMS-like data structure for engineering domains
import { DomainCategory } from "./programs";

export interface Domain {
  id: string;
  name: DomainCategory;
  shortName: string;
  description: string;
  introText: string;
  progressionPath: string;
  icon: string;
  color: string;
  topPrograms: string[]; // program slugs
}

export const domains: Domain[] = [
  {
    id: "civil-structural",
    name: "Civil Engineering",
    shortName: "Civil & Structural",
    description: "Design, analysis, infrastructure, and geotechnical systems",
    introText: "Civil and structural engineering software powers the design of roads, bridges, buildings, water systems, and geotechnical projects. Our programs cover industry-standard tools for structural analysis, terrain modeling, drainage design, and construction documentation.",
    progressionPath: "AutoCAD → Civil 3D / MicroStation → ETABS / SAP2000 → Advanced Analysis (PLAXIS, MIDAS)",
    icon: "Building2",
    color: "accent-green",
    topPrograms: ["autocad", "civil-3d", "etabs", "revit-structure"]
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    description: "CAD / CAE / FEA / CFD — Mechanical design, simulation, and manufacturing workflows",
    introText: "Mechanical engineering software drives product development from conceptual design through manufacturing. Our programs cover 3D CAD modeling, finite element analysis, computational fluid dynamics, and simulation-driven design.",
    progressionPath: "SolidWorks / Inventor → CATIA / NX → ANSYS Mechanical → CFD (Fluent, CFX) → Multiphysics",
    icon: "Cog",
    color: "accent-green",
    topPrograms: ["solidworks", "fusion-360", "ansys-mechanical", "catia"]
  },
  {
    id: "chemical",
    name: "Chemical Engineering",
    shortName: "Chemical",
    description: "Process simulation, plant design, and energy/materials balance",
    introText: "Chemical engineering software enables process simulation, plant modeling, and optimization for oil & gas, chemicals, pharmaceuticals, energy, and manufacturing industries. Our programs cover applied workflows in industry-standard simulation and design tools.",
    progressionPath: "DWSIM → Aspen HYSYS / Aspen Plus → CHEMCAD / PRO/II → gPROMS → COMSOL / MATLAB",
    icon: "FlaskConical",
    color: "accent",
    topPrograms: ["aspen-hysys", "aspen-plus", "chemcad", "dwsim"]
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    shortName: "Electrical & Power",
    description: "Power systems, protection, automation, and simulation",
    introText: "Electrical engineering software addresses power system design, analysis, and control system development. Our programs cover power flow studies, protection coordination, arc flash analysis, automation, and electrical schematic design.",
    progressionPath: "AutoCAD Electrical → ETAP → DIgSILENT / PSS®E → PSCAD → LabVIEW / MATLAB",
    icon: "Zap",
    color: "electrical",
    topPrograms: ["etap", "digsilent-powerfactory", "labview", "autocad-electrical"]
  },
  {
    id: "architectural",
    name: "Architectural Engineering",
    shortName: "Architectural & BIM",
    description: "Architectural design, BIM coordination, and visualization",
    introText: "Architectural software enables comprehensive building design from concept through construction. Our programs cover BIM modeling, documentation, visualization, rendering, and collaboration workflows for architectural practice.",
    progressionPath: "SketchUp / AutoCAD → Revit Architecture / Archicad → Navisworks → Visualization (Lumion, Enscape, 3ds Max)",
    icon: "Building",
    color: "accent",
    topPrograms: ["revit-architecture", "sketchup", "archicad", "lumion"]
  },
  {
    id: "project-controls",
    name: "Construction Planning & Project Controls",
    shortName: "Project Controls",
    description: "Scheduling, cost control, and enterprise project management",
    introText: "Project controls software enables planning, scheduling, and management of construction and engineering projects. Our programs cover enterprise scheduling, resource management, cost estimating, 4D/5D BIM, and earned value analysis.",
    progressionPath: "Microsoft Project → Primavera P6 → Oracle Cloud → 4D/5D BIM (Synchro, Navisworks) → Cost Management",
    icon: "Calendar",
    color: "primary",
    topPrograms: ["primavera-p6", "ms-project", "synchro-4d", "costx"]
  },
  {
    id: "gis-international",
    name: "GIS & Infrastructure Intelligence",
    shortName: "GIS & Infrastructure",
    description: "GIS, computational, and regional engineering tools — Cross-domain applications",
    introText: "GIS and infrastructure data systems address specialized needs in geographic analysis, spatial data management, and computational engineering applicable across civil, environmental, planning, and utility sectors.",
    progressionPath: "ArcGIS Online → ArcGIS Pro / QGIS → Global Mapper → Civil 3D GIS → OpenCities Digital Twins",
    icon: "Globe",
    color: "accent-green",
    topPrograms: ["arcgis-pro", "qgis", "global-mapper", "bentley-opencities"]
  },
  {
    id: "aviation",
    name: "Aviation & Aerospace Engineering",
    shortName: "Aviation & Aerospace",
    description: "Aircraft systems, simulation, and maintenance engineering",
    introText: "Aviation and aerospace engineering software supports aircraft design, flight simulation, structural certification, and maintenance management. Our programs cover CAD/CAE tools for aerospace applications, flight analysis, and MRO systems.",
    progressionPath: "OpenVSP / XFLR5 → SolidWorks Aerospace → CATIA / NX Aerospace → ANSYS / Nastran Aerospace → AMOS / CAMP / Ramco",
    icon: "Plane",
    color: "accent",
    topPrograms: ["catia-aerospace", "ansys-aerospace", "openvsp", "amos-maintenance"]
  }
];

export const getDomainById = (id: string): Domain | undefined => {
  return domains.find(d => d.id === id);
};

export const getDomainByName = (name: DomainCategory): Domain | undefined => {
  return domains.find(d => d.name === name);
};

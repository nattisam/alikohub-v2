// Domain-specific engineering software data

export interface Software {
  name: string;
  icon?: string;
  vendor?: string;
}

export interface DomainSoftwareCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  software: Software[];
}

export const domainSoftware: DomainSoftwareCategory[] = [
  {
    id: "civil-structural",
    title: "Civil & Structural Engineering",
    subtitle: "Design, analysis, infrastructure, and geotechnical systems",
    icon: "Building2",
    accentColor: "accent-green",
    software: [
      { name: "AutoCAD", vendor: "Autodesk" },
      { name: "AutoCAD Civil 3D", vendor: "Autodesk" },
      { name: "MicroStation", vendor: "Bentley" },
      { name: "OpenRoads Designer", vendor: "Bentley" },
      { name: "OpenBridge Modeler", vendor: "Bentley" },
      { name: "OpenRail Designer", vendor: "Bentley" },
      { name: "ETABS", vendor: "CSI" },
      { name: "SAP2000", vendor: "CSI" },
      { name: "SAFE", vendor: "CSI" },
      { name: "STAAD.Pro", vendor: "Bentley" },
      { name: "MIDAS Civil", vendor: "MIDAS" },
      { name: "MIDAS Gen", vendor: "MIDAS" },
      { name: "Robot Structural Analysis", vendor: "Autodesk" },
      { name: "Tekla Structural Designer", vendor: "Trimble" },
      { name: "PLAXIS 2D / 3D", vendor: "Bentley" },
      { name: "GeoStudio", vendor: "Seequent" },
      { name: "LUSAS", vendor: "LUSAS" },
      { name: "CSI Bridge", vendor: "CSI" },
      { name: "InfraWorks", vendor: "Autodesk" },
      { name: "Revit Structure", vendor: "Autodesk" },
      { name: "ProtaStructure", vendor: "Prota" },
      { name: "ProtaDetails", vendor: "Prota" }
    ]
  },
  {
    id: "mechanical",
    title: "Mechanical Engineering",
    subtitle: "CAD / CAE / FEA / CFD — Mechanical design, simulation, and manufacturing workflows",
    icon: "Cog",
    accentColor: "accent-green",
    software: [
      { name: "SolidWorks", vendor: "Dassault" },
      { name: "CATIA", vendor: "Dassault" },
      { name: "Creo Parametric", vendor: "PTC" },
      { name: "Siemens NX", vendor: "Siemens" },
      { name: "Autodesk Inventor", vendor: "Autodesk" },
      { name: "Fusion 360", vendor: "Autodesk" },
      { name: "ANSYS Mechanical", vendor: "ANSYS" },
      { name: "ANSYS Fluent", vendor: "ANSYS" },
      { name: "ANSYS CFX", vendor: "ANSYS" },
      { name: "Abaqus", vendor: "Dassault" },
      { name: "HyperMesh", vendor: "Altair" },
      { name: "NASTRAN", vendor: "MSC" },
      { name: "COMSOL Multiphysics", vendor: "COMSOL" },
      { name: "MSC Patran", vendor: "MSC" },
      { name: "MSC Adams", vendor: "MSC" },
      { name: "MATLAB", vendor: "MathWorks" },
      { name: "Simulink", vendor: "MathWorks" }
    ]
  },
  {
    id: "chemical",
    title: "Chemical Engineering",
    subtitle: "Process simulation, plant design, and energy/materials balance",
    icon: "FlaskConical",
    accentColor: "accent",
    software: [
      { name: "Aspen Plus", vendor: "AspenTech" },
      { name: "Aspen HYSYS", vendor: "AspenTech" },
      { name: "Aspen PIMS", vendor: "AspenTech" },
      { name: "CHEMCAD", vendor: "Chemstations" },
      { name: "PRO/II", vendor: "Schneider Electric" },
      { name: "gPROMS", vendor: "Siemens" },
      { name: "DWSIM", vendor: "Open Source" },
      { name: "COMSOL Multiphysics", vendor: "COMSOL" },
      { name: "MATLAB", vendor: "MathWorks" },
      { name: "Simulink", vendor: "MathWorks" }
    ]
  },
  {
    id: "electrical",
    title: "Electrical & Power Engineering",
    subtitle: "Power systems, protection, automation, and simulation",
    icon: "Zap",
    accentColor: "electrical",
    software: [
      { name: "ETAP", vendor: "ETAP" },
      { name: "DIgSILENT PowerFactory", vendor: "DIgSILENT" },
      { name: "PSCAD", vendor: "Manitoba Hydro" },
      { name: "PSS®E", vendor: "Siemens" },
      { name: "PSpice", vendor: "Cadence" },
      { name: "MATLAB", vendor: "MathWorks" },
      { name: "Simulink", vendor: "MathWorks" },
      { name: "LabVIEW", vendor: "NI" },
      { name: "PowerWorld Simulator", vendor: "PowerWorld" },
      { name: "CYME", vendor: "Eaton" },
      { name: "SKM PowerTools", vendor: "SKM" },
      { name: "EasyPower", vendor: "EasyPower" },
      { name: "AutoCAD Electrical", vendor: "Autodesk" },
      { name: "Revit Electrical", vendor: "Autodesk" }
    ]
  },
  {
    id: "architectural-bim",
    title: "Architectural Engineering & BIM",
    subtitle: "Architectural design, BIM coordination, and visualization",
    icon: "Building",
    accentColor: "accent",
    software: [
      { name: "AutoCAD", vendor: "Autodesk" },
      { name: "Revit Architecture", vendor: "Autodesk" },
      { name: "Archicad", vendor: "Graphisoft" },
      { name: "Navisworks Manage", vendor: "Autodesk" },
      { name: "SketchUp", vendor: "Trimble" },
      { name: "Rhino", vendor: "McNeel" },
      { name: "Grasshopper", vendor: "McNeel" },
      { name: "Twinmotion", vendor: "Epic Games" },
      { name: "Lumion", vendor: "Lumion" },
      { name: "Enscape", vendor: "Enscape" },
      { name: "3ds Max", vendor: "Autodesk" },
      { name: "Blender", vendor: "Blender Foundation" },
      { name: "Vectorworks", vendor: "Vectorworks" },
      { name: "BIM 360 / ACC", vendor: "Autodesk" }
    ]
  },
  {
    id: "project-controls",
    title: "Project Controls & Construction Planning",
    subtitle: "Scheduling, cost control, and enterprise project management",
    icon: "Calendar",
    accentColor: "primary",
    software: [
      { name: "Primavera P6", vendor: "Oracle" },
      { name: "Oracle Primavera Cloud", vendor: "Oracle" },
      { name: "Microsoft Project", vendor: "Microsoft" },
      { name: "Asta Powerproject", vendor: "Elecosoft" },
      { name: "PlanSwift", vendor: "Trimble" },
      { name: "Candy (CCS)", vendor: "CCS" },
      { name: "CostX", vendor: "Exactal" },
      { name: "Synchro 4D", vendor: "Bentley" },
      { name: "Navisworks Timeliner", vendor: "Autodesk" },
      { name: "BIM 4D / 5D Tools", vendor: "Various" }
    ]
  },
  {
    id: "gis-infrastructure",
    title: "GIS & Infrastructure Data Systems",
    subtitle: "Cross-Domain — Used across Civil, Environmental, Planning & Utilities",
    icon: "Globe",
    accentColor: "accent-green",
    software: [
      { name: "ArcGIS Pro", vendor: "Esri" },
      { name: "ArcGIS Online", vendor: "Esri" },
      { name: "QGIS", vendor: "Open Source" },
      { name: "Global Mapper", vendor: "Blue Marble" },
      { name: "Civil 3D GIS Workflows", vendor: "Autodesk" },
      { name: "Bentley OpenCities", vendor: "Bentley" }
    ]
  },
  {
    id: "aviation",
    title: "Aviation & Aerospace Engineering",
    subtitle: "Aircraft systems, simulation, and maintenance engineering",
    icon: "Plane",
    accentColor: "accent",
    software: [
      { name: "CATIA (Aerospace)", vendor: "Dassault" },
      { name: "Siemens NX (Aerospace)", vendor: "Siemens" },
      { name: "SolidWorks (Aerospace)", vendor: "Dassault" },
      { name: "ANSYS Aerospace Modules", vendor: "ANSYS" },
      { name: "MATLAB Aerospace Toolbox", vendor: "MathWorks" },
      { name: "Simulink Aerospace Blockset", vendor: "MathWorks" },
      { name: "OpenVSP", vendor: "NASA" },
      { name: "XFLR5", vendor: "Open Source" },
      { name: "MSC Nastran (Aerospace)", vendor: "MSC" },
      { name: "AMOS", vendor: "Swiss AS" },
      { name: "CAMP Systems", vendor: "CAMP" },
      { name: "Ramco Aviation", vendor: "Ramco" }
    ]
  }
];

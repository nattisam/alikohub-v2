// Software icon mapping - maps software/program names to visual identifiers

export interface SoftwareIcon {
  initials: string;
  color: string;
  vendor: string;
}

// Map program slugs/titles to their software visual representation
export const softwareIconMap: Record<string, SoftwareIcon> = {
  // Autodesk Products
  autocad: { initials: "CAD", color: "accent-orange", vendor: "Autodesk" },
  "autocad-arch": {
    initials: "CAD",
    color: "accent-orange",
    vendor: "Autodesk",
  },
  "civil-3d": { initials: "C3D", color: "accent-orange", vendor: "Autodesk" },
  revit: { initials: "RVT", color: "primary", vendor: "Autodesk" },
  "revit-structure": { initials: "RST", color: "primary", vendor: "Autodesk" },
  "revit-architecture": {
    initials: "RAC",
    color: "accent",
    vendor: "Autodesk",
  },
  "revit-electrical": {
    initials: "REL",
    color: "electrical",
    vendor: "Autodesk",
  },
  navisworks: { initials: "NW", color: "accent-green", vendor: "Autodesk" },
  infraworks: { initials: "IW", color: "accent-orange", vendor: "Autodesk" },
  inventor: { initials: "INV", color: "accent-green", vendor: "Autodesk" },
  "fusion-360": { initials: "F36", color: "accent-orange", vendor: "Autodesk" },
  "3ds-max": { initials: "3DS", color: "accent", vendor: "Autodesk" },
  "autocad-electrical": {
    initials: "ACE",
    color: "electrical",
    vendor: "Autodesk",
  },
  "robot-structural": { initials: "RSA", color: "primary", vendor: "Autodesk" },

  // Bentley Products
  microstation: { initials: "MS", color: "accent-green", vendor: "Bentley" },
  "openroads-designer": {
    initials: "ORD",
    color: "accent-orange",
    vendor: "Bentley",
  },
  "openbridge-modeler": {
    initials: "OBM",
    color: "accent-orange",
    vendor: "Bentley",
  },
  "openrail-designer": {
    initials: "ORL",
    color: "accent-orange",
    vendor: "Bentley",
  },
  "staad-pro": { initials: "STD", color: "primary", vendor: "Bentley" },
  plaxis: { initials: "PLX", color: "accent-green", vendor: "Bentley" },
  "synchro-4d": { initials: "S4D", color: "primary", vendor: "Bentley" },
  "bentley-opencities": {
    initials: "OPC",
    color: "accent-green",
    vendor: "Bentley",
  },

  // CSI Products
  etabs: { initials: "ETB", color: "primary", vendor: "CSI" },
  sap2000: { initials: "SAP", color: "primary", vendor: "CSI" },
  safe: { initials: "SAF", color: "primary", vendor: "CSI" },
  "csi-bridge": { initials: "CSB", color: "primary", vendor: "CSI" },

  // Prota Products
  protastructure: { initials: "PRS", color: "primary", vendor: "Prota" },
  protadetails: { initials: "PRD", color: "primary", vendor: "Prota" },

  // MIDAS Products
  "midas-civil": { initials: "MC", color: "accent", vendor: "MIDAS" },
  "midas-gen": { initials: "MG", color: "accent", vendor: "MIDAS" },

  // Trimble/Tekla
  "tekla-structural-designer": {
    initials: "TSD",
    color: "accent-orange",
    vendor: "Trimble",
  },
  sketchup: { initials: "SKP", color: "accent-orange", vendor: "Trimble" },
  planswift: { initials: "PSW", color: "accent-orange", vendor: "Trimble" },

  // Dassault Products
  solidworks: { initials: "SW", color: "accent-green", vendor: "Dassault" },
  catia: { initials: "CAT", color: "primary", vendor: "Dassault" },
  abaqus: { initials: "ABQ", color: "accent-green", vendor: "Dassault" },

  // PTC Products
  "creo-parametric": { initials: "CRE", color: "accent-green", vendor: "PTC" },

  // Siemens Products
  "siemens-nx": { initials: "NX", color: "accent", vendor: "Siemens" },
  psse: { initials: "PSS", color: "electrical", vendor: "Siemens" },

  // ANSYS Products
  "ansys-mechanical": {
    initials: "ANM",
    color: "accent-orange",
    vendor: "ANSYS",
  },
  "ansys-fluent": { initials: "FLU", color: "accent", vendor: "ANSYS" },
  "ansys-cfx": { initials: "CFX", color: "accent", vendor: "ANSYS" },

  // Altair Products
  hypermesh: { initials: "HM", color: "accent-green", vendor: "Altair" },

  // MSC Products
  nastran: { initials: "NAS", color: "accent-green", vendor: "MSC" },
  "msc-patran": { initials: "PAT", color: "accent-green", vendor: "MSC" },
  "msc-adams": { initials: "ADM", color: "accent-green", vendor: "MSC" },

  // COMSOL
  comsol: { initials: "CMS", color: "primary", vendor: "COMSOL" },

  // Power Systems
  etap: { initials: "ETP", color: "electrical", vendor: "ETAP" },
  "digsilent-powerfactory": {
    initials: "DGS",
    color: "electrical",
    vendor: "DIgSILENT",
  },
  pscad: { initials: "PSC", color: "electrical", vendor: "Manitoba" },
  pspice: { initials: "PSP", color: "electrical", vendor: "Cadence" },
  powerworld: { initials: "PWS", color: "electrical", vendor: "PowerWorld" },
  cyme: { initials: "CYM", color: "electrical", vendor: "Eaton" },
  "skm-powertools": { initials: "SKM", color: "electrical", vendor: "SKM" },
  easypower: { initials: "EPW", color: "electrical", vendor: "EasyPower" },
  labview: { initials: "LV", color: "electrical", vendor: "NI" },

  // MathWorks
  matlab: { initials: "MAT", color: "accent-orange", vendor: "MathWorks" },
  "matlab-electrical": {
    initials: "MAT",
    color: "electrical",
    vendor: "MathWorks",
  },
  simulink: { initials: "SIM", color: "accent-orange", vendor: "MathWorks" },
  "simulink-electrical": {
    initials: "SIM",
    color: "electrical",
    vendor: "MathWorks",
  },

  // GIS
  "arcgis-pro": { initials: "ARC", color: "accent-green", vendor: "Esri" },
  "arcgis-online": { initials: "AGO", color: "accent-green", vendor: "Esri" },
  qgis: { initials: "QG", color: "accent-green", vendor: "Open Source" },
  "global-mapper": {
    initials: "GM",
    color: "accent-green",
    vendor: "Blue Marble",
  },
  "civil-3d-gis": {
    initials: "GIS",
    color: "accent-green",
    vendor: "Autodesk",
  },

  // Aviation & Aerospace
  "catia-aerospace": { initials: "CAT", color: "accent", vendor: "Dassault" },
  "nx-aerospace": { initials: "NX", color: "accent", vendor: "Siemens" },
  "solidworks-aerospace": {
    initials: "SW",
    color: "accent",
    vendor: "Dassault",
  },
  "ansys-aerospace": { initials: "ANS", color: "accent", vendor: "ANSYS" },
  "matlab-aerospace-toolbox": {
    initials: "MAT",
    color: "accent",
    vendor: "MathWorks",
  },
  "simulink-aerospace": {
    initials: "SIM",
    color: "accent",
    vendor: "MathWorks",
  },
  openvsp: { initials: "VSP", color: "accent", vendor: "NASA" },
  xflr5: { initials: "XFL", color: "accent", vendor: "Open Source" },
  "msc-nastran-aerospace": { initials: "NAS", color: "accent", vendor: "MSC" },
  "amos-maintenance": { initials: "AMS", color: "accent", vendor: "Swiss AS" },
  "camp-systems": { initials: "CMP", color: "accent", vendor: "CAMP" },
  "ramco-aviation": { initials: "RMC", color: "accent", vendor: "Ramco" },

  // Geotechnical
  geostudio: { initials: "GEO", color: "accent-green", vendor: "Seequent" },
  lusas: { initials: "LUS", color: "primary", vendor: "LUSAS" },

  // Visualization
  lumion: { initials: "LUM", color: "accent", vendor: "Lumion" },
  enscape: { initials: "ENS", color: "accent", vendor: "Enscape" },
  twinmotion: { initials: "TM", color: "accent", vendor: "Epic" },
  rhino: { initials: "RH", color: "accent", vendor: "McNeel" },
  grasshopper: { initials: "GH", color: "accent", vendor: "McNeel" },
  blender: { initials: "BLN", color: "accent-orange", vendor: "Blender" },
  archicad: { initials: "AC", color: "accent", vendor: "Graphisoft" },
  vectorworks: { initials: "VW", color: "accent", vendor: "Vectorworks" },

  // Project Controls
  "primavera-p6": { initials: "P6", color: "primary", vendor: "Oracle" },
  "primavera-cloud": { initials: "OPC", color: "primary", vendor: "Oracle" },
  "ms-project": { initials: "MSP", color: "primary", vendor: "Microsoft" },
  "asta-powerproject": {
    initials: "APP",
    color: "primary",
    vendor: "Elecosoft",
  },
  "candy-ccs": { initials: "CCS", color: "accent-orange", vendor: "CCS" },
  costx: { initials: "CTX", color: "accent-orange", vendor: "Exactal" },
  "navisworks-timeliner": {
    initials: "TL",
    color: "accent-green",
    vendor: "Autodesk",
  },
  "bim-4d-5d": { initials: "4D5", color: "primary", vendor: "Various" },
  "bim-360": { initials: "360", color: "primary", vendor: "Autodesk" },
};

// Get software icon data from slug or title
export const getSoftwareIcon = (slugOrTitle?: string): SoftwareIcon => {
  if (!slugOrTitle) {
    return {
      initials: "ENG",
      color: "primary",
      vendor: "Engineering",
    };
  }

  // Try direct match first
  const directMatch = softwareIconMap[slugOrTitle.toLowerCase()];

  // Try to find partial match
  const key = Object.keys(softwareIconMap).find(
    (k) =>
      slugOrTitle.toLowerCase().includes(k) ||
      k.includes(slugOrTitle.toLowerCase().split(" ")[0]),
  );

  if (key) return softwareIconMap[key];

  // Default fallback
  return {
    initials: slugOrTitle.slice(0, 3).toUpperCase(),
    color: "primary",
    vendor: "Engineering",
  };
};

// Color style mappings - enhanced contrast with brighter text
export const iconColorStyles: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  primary: {
    bg: "bg-primary/15",
    text: "text-[hsl(207_90%_70%)]",
    border: "border-primary/40",
  },
  accent: {
    bg: "bg-accent/15",
    text: "text-[hsl(195_100%_75%)]",
    border: "border-accent/40",
  },
  "accent-green": {
    bg: "bg-accent-green/15",
    text: "text-[hsl(80_70%_70%)]",
    border: "border-accent-green/40",
  },
  "accent-orange": {
    bg: "bg-accent-orange/15",
    text: "text-[hsl(155_55%_68%)]",
    border: "border-accent-orange/40",
  },
  electrical: {
    bg: "bg-[hsl(280_68%_55%)]/15",
    text: "text-[hsl(280_68%_78%)]",
    border: "border-[hsl(280_68%_55%)]/40",
  },
};

// Thumbnail mapping for program cards
import autocadThumb from "@/assets/categories/stem/programs/autocad-thumb.jpg";
import civil3dThumb from "@/assets/categories/stem/programs/civil3d-thumb.jpg";
import microstationThumb from "@/assets/categories/stem/programs/microstation-thumb.jpg";
import openroadsThumb from "@/assets/categories/stem/programs/openroads-thumb.jpg";
import etabsThumb from "@/assets/categories/stem/programs/etabs-thumb.jpg";
import sap2000Thumb from "@/assets/categories/stem/programs/sap2000-thumb.jpg";
import revitStructureThumb from "@/assets/categories/stem/programs/revit-structure-thumb.jpg";
import solidworksThumb from "@/assets/categories/stem/programs/solidworks-thumb.jpg";
import catiaThumb from "@/assets/categories/stem/programs/catia-thumb.jpg";
import creoThumb from "@/assets/categories/stem/programs/creo-thumb.jpg";
import siemensNxThumb from "@/assets/categories/stem/programs/siemens-nx-thumb.jpg";
import inventorThumb from "@/assets/categories/stem/programs/inventor-thumb.jpg";
import fusion360Thumb from "@/assets/categories/stem/programs/fusion360-thumb.jpg";
import ansysThumb from "@/assets/categories/stem/programs/ansys-thumb.jpg";
import ansysFluentThumb from "@/assets/categories/stem/programs/ansys-fluent-thumb.jpg";
import aspenPlusThumb from "@/assets/categories/stem/programs/aspen-plus-thumb.jpg";
import aspenHysysThumb from "@/assets/categories/stem/programs/aspen-hysys-thumb.jpg";
import aspenPimsThumb from "@/assets/categories/stem/programs/aspen-pims-thumb.jpg";
import chemcadThumb from "@/assets/categories/stem/programs/chemcad-thumb.jpg";
import etapThumb from "@/assets/categories/stem/programs/etap-thumb.jpg";
import digsilentThumb from "@/assets/categories/stem/programs/digsilent-thumb.jpg";
import pscadThumb from "@/assets/categories/stem/programs/pscad-thumb.jpg";
import psseThumb from "@/assets/categories/stem/programs/psse-thumb.jpg";
import revitArchThumb from "@/assets/categories/stem/programs/revit-arch-thumb.jpg";
import sketchupThumb from "@/assets/categories/stem/programs/sketchup-thumb.jpg";
import archicadThumb from "@/assets/categories/stem/programs/archicad-thumb.jpg";
import navisworksThumb from "@/assets/categories/stem/programs/navisworks-thumb.jpg";
import primaveraThumb from "@/assets/categories/stem/programs/primavera-thumb.jpg";
import primaveraCloudThumb from "@/assets/categories/stem/programs/primavera-cloud-thumb.jpg";
import msProjectThumb from "@/assets/categories/stem/programs/ms-project-thumb.jpg";
import astaPowerprojectThumb from "@/assets/categories/stem/programs/asta-powerproject-thumb.jpg";
import arcgisThumb from "@/assets/categories/stem/programs/arcgis-thumb.jpg";
import arcgisOnlineThumb from "@/assets/categories/stem/programs/arcgis-online-thumb.jpg";
import qgisThumb from "@/assets/categories/stem/programs/qgis-thumb.jpg";
import globalMapperThumb from "@/assets/categories/stem/programs/global-mapper-thumb.jpg";
import nxAerospaceThumb from "@/assets/categories/stem/programs/nx-aerospace-thumb.jpg";
import solidworksAerospaceThumb from "@/assets/categories/stem/programs/solidworks-aerospace-thumb.jpg";
import ansysAerospaceThumb from "@/assets/categories/stem/programs/ansys-aerospace-thumb.jpg";

export const programThumbnails: Record<string, string> = {
  // Civil Engineering
  "autocad": autocadThumb,
  "civil-3d": civil3dThumb,
  "microstation": microstationThumb,
  "openroads-designer": openroadsThumb,
  
  // Structural
  "etabs": etabsThumb,
  "sap2000": sap2000Thumb,
  "revit-structure": revitStructureThumb,
  
  // Mechanical Engineering
  "solidworks": solidworksThumb,
  "catia": catiaThumb,
  "creo-parametric": creoThumb,
  "siemens-nx": siemensNxThumb,
  "inventor": inventorThumb,
  "fusion-360": fusion360Thumb,
  "ansys-mechanical": ansysThumb,
  "ansys-fluent": ansysFluentThumb,
  
  // Chemical Engineering
  "aspen-plus": aspenPlusThumb,
  "aspen-hysys": aspenHysysThumb,
  "aspen-pims": aspenPimsThumb,
  "chemcad": chemcadThumb,
  
  // Electrical Engineering
  "etap": etapThumb,
  "digsilent-powerfactory": digsilentThumb,
  "pscad": pscadThumb,
  "psse": psseThumb,
  
  // Architectural Engineering
  "autocad-arch": autocadThumb,
  "revit-architecture": revitArchThumb,
  "archicad": archicadThumb,
  "sketchup": sketchupThumb,
  "navisworks": navisworksThumb,
  
  // Project Controls
  "primavera-p6": primaveraThumb,
  "primavera-cloud": primaveraCloudThumb,
  "ms-project": msProjectThumb,
  "asta-powerproject": astaPowerprojectThumb,
  
  // GIS
  "arcgis-pro": arcgisThumb,
  "arcgis-online": arcgisOnlineThumb,
  "qgis": qgisThumb,
  "global-mapper": globalMapperThumb,
  
  // Aviation & Aerospace
  "catia-aerospace": catiaThumb,
  "nx-aerospace": nxAerospaceThumb,
  "solidworks-aerospace": solidworksAerospaceThumb,
  "ansys-aerospace": ansysAerospaceThumb,
};

export function getProgramThumbnail(slug: string): string | undefined {
  return programThumbnails[slug];
}

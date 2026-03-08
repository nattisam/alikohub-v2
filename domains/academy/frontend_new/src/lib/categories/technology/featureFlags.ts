// Feature Flags / Visibility Toggles for Aliko Academy - Tech
// All features can be toggled on/off via this config

export interface FeatureFlags {
  employerPartnerPortal: boolean;
  credentialVerification: boolean;
  programComparison: boolean;
  skillAssessment: boolean;
  learningPaths: boolean;
  eventsAndCommunity: boolean;
  staffDashboard: boolean;
  alumniNetwork: boolean;
  projectsGallery: boolean;
  mentorProfiles: boolean;
}

// Default feature flags - all enabled for development
export const defaultFeatureFlags: FeatureFlags = {
  employerPartnerPortal: true,
  credentialVerification: true,
  programComparison: true,
  skillAssessment: true,
  learningPaths: true,
  eventsAndCommunity: true,
  staffDashboard: true,
  alumniNetwork: true,
  projectsGallery: true,
  mentorProfiles: true,
};

// Get current feature flags (could be connected to CMS/backend in future)
export const getFeatureFlags = (): FeatureFlags => {
  // In production, this could fetch from CMS or localStorage
  return defaultFeatureFlags;
};

// Check if a specific feature is enabled
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return flags[feature];
};

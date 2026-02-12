// Shared domain "shapes" for the rental platform

export const DEFAULT_TENANT_PREFS = {
  budgetMin: 0,
  budgetMax: 0,
  preferredAreas: [], // e.g. ['Thamel', 'Koteshwor']
  rooms: 1,
  furnishing: 'any', // 'none' | 'semi' | 'full' | 'any'
  waterPriority: 'any', // 'low' | 'medium' | 'high' | 'any'
  wifiRequired: false,
  floorPreference: 'any', // 'ground' | 'middle' | 'top' | 'any'
  parking: 'any', // 'none' | '2w' | '4w' | 'both' | 'any'
  genderCompatibility: 'any', // 'male' | 'female' | 'any'
  lifestyle: 'any', // 'quiet' | 'social' | 'any'
  familySize: 1,
  maxCommuteKm: 3,
};

// Simple helper to clone defaults (avoid accidental mutation)
export function createDefaultTenantPrefs() {
  return { ...DEFAULT_TENANT_PREFS, preferredAreas: [] };
}


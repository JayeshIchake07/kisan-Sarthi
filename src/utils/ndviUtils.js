/**
 * Returns the theme color for a given NDVI value.
 * @param {number} v - NDVI value (0–1)
 * @returns {string} Hex color string
 */
export function ndviColor(v) {
  return v < 0.2 ? "#ef4444" : v < 0.4 ? "#f59e0b" : "#10b981";
}

/**
 * Returns a human-readable stress label for a given NDVI value.
 * @param {number} v - NDVI value (0–1)
 * @returns {"Severe"|"Mild"|"Healthy"}
 */
export function ndviLabel(v) {
  return v < 0.2 ? "Severe" : v < 0.4 ? "Mild" : "Healthy";
}

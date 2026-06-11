/**
 * Application-level constants for navigation, titles, and configuration.
 */

/** @type {Array<{id: string, label: string, icon: string}>} */
export const TABS = [
  { id: "map", label: "Map", icon: "🛰️" },
  { id: "advisory", label: "Advisory", icon: "📋" },
  { id: "fpo", label: "FPO", icon: "👥" },
  { id: "loan", label: "Loan", icon: "🏦" },
  { id: "benchmark", label: "Rank", icon: "📊" },
  { id: "climate", label: "Climate", icon: "⚡" },
  { id: "market", label: "Market", icon: "💰" },
];

/** @type {Record<string, string>} */
export const TITLES = {
  map: "Satellite Map",
  advisory: "Crop Advisories",
  fpo: "FPO Dashboard",
  loan: "Loan Score",
  benchmark: "Benchmarking",
  climate: "Climate Alerts",
  market: "Market Prices",
};

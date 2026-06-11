/**
 * @typedef {Object} ClimateAlert
 * @property {string} type
 * @property {string} typeKey
 * @property {string} district
 * @property {"critical"|"warning"} sev
 * @property {number} farms
 * @property {string} msg
 * @property {string} msgKey
 */

/**
 * @typedef {Object} VulnerabilityEntry
 * @property {string} crop
 * @property {string} stage
 * @property {number} risk
 */

/**
 * Retrieves current climate alerts.
 * Currently returns static demo data; ready for Open-Meteo / NASA FIRMS API.
 * Includes translation keys for consistent multilingual i18n support.
 *
 * @returns {Promise<{alerts: ClimateAlert[], vulnerabilities: VulnerabilityEntry[], history: string[][]}>}
 */
export async function getClimateAlerts() {
  const alerts = [
    {
      type: "Heatwave",
      typeKey: "heatwave",
      district: "Nashik",
      sev: "critical",
      farms: 14,
      msg: "Max temp 42°C forecast Fri–Sun. Wheat in flowering stage faces 40% yield loss.",
      msgKey: "heatwaveAlertMsg"
    },
    {
      type: "Heavy Rain",
      typeKey: "heavyRain",
      district: "Pune",
      sev: "warning",
      farms: 8,
      msg: "60mm rainfall Thursday. Harvest-ready onion crops at risk of field rotting.",
      msgKey: "heavyRainAlertMsg"
    },
    {
      type: "Pest Outbreak",
      typeKey: "pestOutbreak",
      district: "Solapur",
      sev: "critical",
      farms: 23,
      msg: "Cotton bollworm cluster detected across 23 adjacent farms. Spray within 48h.",
      msgKey: "pestOutbreakAlertMsg"
    },
  ];

  const vulnerabilities = [
    { crop: "Wheat", stage: "flowering", risk: 85 },
    { crop: "Cotton", stage: "bollDev", risk: 72 },
    { crop: "Onion", stage: "harvest", risk: 65 },
    { crop: "Rice", stage: "grainFill", risk: 38 },
    { crop: "Sugarcane", stage: "vegetative", risk: 20 },
  ];

  const history = [
    ["June 3", "frostRisk", "Nagpur"],
    ["May 28", "locustWarning", "Solapur"],
    ["May 19", "droughtWatch", "Aurangabad"],
    ["May 11", "hailstorm", "Nashik"],
  ];

  return { alerts, vulnerabilities, history };
}

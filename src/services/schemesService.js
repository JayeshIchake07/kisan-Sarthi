import schemesData from "../data/schemes.json";

/**
 * @typedef {Object} EligibilityResult
 * @property {string} schemeId
 * @property {"Eligible"|"Potentially Eligible"|"Not Eligible"} status
 * @property {string} reason
 * @property {number} estimatedValue
 */

/**
 * programmatically evaluates eligibility for a given farmer plot.
 * Future-ready simulation for live state/federal eligibility APIs.
 *
 * @param {import("../data/seedData").Plot} plot
 * @returns {Promise<Record<string, EligibilityResult>>}
 */
export async function evaluateAllSchemes(plot) {
  // Simulate live network latency of government database APIs
  await new Promise(resolve => setTimeout(resolve, 350));

  if (!plot) return {};

  const results = {};

  // 1. PM-KISAN
  if (plot.acres > 0) {
    results["pm-kisan"] = {
      schemeId: "pm-kisan",
      status: "Eligible",
      reason: `Land holding of ${plot.acres} acres successfully verified against land records database.`,
      estimatedValue: 6000
    };
  } else {
    results["pm-kisan"] = {
      schemeId: "pm-kisan",
      status: "Not Eligible",
      reason: "No agricultural land holding registered under this identity.",
      estimatedValue: 0
    };
  }

  // 2. PMFBY (Crop Insurance)
  if (plot.stress === "severe") {
    results["pmfby"] = {
      schemeId: "pmfby",
      status: "Eligible",
      reason: `Crop health analysis shows severe stress (NDVI ${plot.ndvi}). Eligible for immediate damage assessment & claim filing.`,
      estimatedValue: Math.round(plot.acres * 15000) // approx payout
    };
  } else if (plot.stress === "mild") {
    results["pmfby"] = {
      schemeId: "pmfby",
      status: "Eligible",
      reason: `Mild crop stress detected (NDVI ${plot.ndvi}). Enrolled in seasonal index insurance. Eligible for review.`,
      estimatedValue: Math.round(plot.acres * 5000)
    };
  } else {
    results["pmfby"] = {
      schemeId: "pmfby",
      status: "Potentially Eligible",
      reason: "Crop is healthy (NDVI > 0.4). Active cover is active, but no damage claims can be filed at this time.",
      estimatedValue: 0
    };
  }

  // 3. KCC (Kisan Credit Card)
  if (plot.acres >= 1.5) {
    results["kcc"] = {
      schemeId: "kcc",
      status: "Eligible",
      reason: `Eligible for credit limits up to ₹${Math.min(3, Math.round(plot.acres * 0.45 * 10) / 10)} Lakh based on crop type and area scaling factor.`,
      estimatedValue: Math.round(plot.acres * 45000)
    };
  } else if (plot.acres > 0) {
    results["kcc"] = {
      schemeId: "kcc",
      status: "Potentially Eligible",
      reason: "Land holding is below 1.5 acres. Eligible for small-holder credit facilities subject to bank inspection.",
      estimatedValue: 25000
    };
  } else {
    results["kcc"] = {
      schemeId: "kcc",
      status: "Not Eligible",
      reason: "Requires verified cultivation area or active crop cycle.",
      estimatedValue: 0
    };
  }

  // 4. Soil Health Card
  results["soil-health"] = {
    schemeId: "soil-health",
    status: "Eligible",
    reason: "Entitled to free biannual soil testing. Last test date Nashik Lab: 18 months ago (Expired/Due).",
    estimatedValue: 1200
  };

  // 5. MahaDBT Pokra (Nanaji Deshmukh Krishi Sanjivani)
  const pokraDistricts = ["Nashik", "Jalna", "Beed", "Latur", "Aurangabad", "Buldhana", "Osmanabad", "Parbhani", "Nanded"];
  if (pokraDistricts.includes(plot.district)) {
    results["state-scheme"] = {
      schemeId: "state-scheme",
      status: "Eligible",
      reason: `District ${plot.district} is registered under the climate-resilience list. Highly eligible for solar & micro-irrigation subsidies.`,
      estimatedValue: 45000
    };
  } else {
    results["state-scheme"] = {
      schemeId: "state-scheme",
      status: "Potentially Eligible",
      reason: `District is outside primary Pokra clusters, but eligible for general state solar pumps and farm pond incentives.`,
      estimatedValue: 15000
    };
  }

  return results;
}

/**
 * Returns the list of schemes merged with their eligibility status.
 *
 * @param {import("../data/seedData").Plot} plot
 */
export async function getSchemesWithEligibility(plot) {
  const eligibility = await evaluateAllSchemes(plot);
  return schemesData.map(scheme => ({
    ...scheme,
    eligibility: eligibility[scheme.id] || {
      status: "Potentially Eligible",
      reason: "Awaiting database synchronization.",
      estimatedValue: 0
    }
  }));
}

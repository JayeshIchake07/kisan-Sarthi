import { callGemini } from "./geminiService";

/**
 * Generates a farm advisory for a specific plot using Gemini AI (returns plain text).
 *
 * @param {import("../data/seedData").Plot} plot - The plot/farmer data
 * @returns {Promise<string>} Advisory text
 */
export async function generateAdvisory(plot) {
  const prompt = `You are Kisan Sarthi, advisor for Indian farmers.
Farmer: ${plot.farmer}, ${plot.district}, Maharashtra
Crop: ${plot.crop}, ${plot.acres} acres, NDVI: ${plot.ndvi}, NDWI: ${plot.ndwi}, Stress: ${plot.stress}, Sown: ${plot.sowDays} days ago
Write a brief farm advisory:
ADVISORY: 2 plain sentences (use Hindi words like fasal/kheti naturally)
ACTION: one specific step with product, dose, timing
RISK: yield loss % if untreated`;

  return callGemini(prompt);
}

/**
 * Generates a full agricultural intelligence advisory returned as a structured JSON object.
 * Inputs: Crop, District, NDVI, NDWI, Growth Stage, Weather, Rain, Heat Risk, Pest Risk, Market Prices, Historical NDVI.
 * Displays: Health Status, Confidence, Issue, Causes, Actions, Weather Impact, Yield Impact, Market Rec, Follow-up.
 *
 * @param {import("../data/seedData").Plot} plot
 */
export async function generateStructuredAdvisory(plot, lang = 'en') {
  if (!plot) return null;

  const langNames = { en: 'English', mr: 'Marathi', hi: 'Hindi' };
  const responseLang = langNames[lang] || 'English';

  // Determine Growth Stage
  let growthStage = "Vegetative Stage";
  if (plot.sowDays < 30) growthStage = "Seedling / Early Vegetative";
  else if (plot.sowDays < 55) growthStage = "Mid-Vegetative / Branching";
  else if (plot.sowDays < 85) growthStage = "Flowering & Pod/Grain Development";
  else growthStage = "Maturation & Harvest Readiness";

  // Telemetry simulation
  const weatherForecast = "Temp: 34°C - 37°C, Humidity: 40-48%, Winds: 10-15 km/h, Partly Cloudy";
  const rainForecast = plot.stress === 'severe' ? "Critical moisture deficit. No rainfall predicted for next 10 days." : "Normal weather. Light convective showers (5-10mm) expected in next 5 days.";
  const heatRisk = plot.stress === 'severe' ? "High Risk (midday temp peaks at 38°C)" : "Moderate Heat Risk";
  const pestRisk = plot.crop === 'Cotton' ? "High threat of Pink Bollworm" : plot.crop === 'Soybeans' ? "Moderate risk of Spodoptera litura & Semilooper" : "Low to Moderate Pest Activity";
  const marketPrice = `₹${Math.round(4500 + plot.ndvi * 1500)} / quintal at local APMC Mandi (Trend: Stable)`;
  
  // Historical NDVI description
  const historicalNDVI = `Steady growth cycle starting at 0.15, peaking at ${plot.ndvi} at Day ${plot.sowDays}. Current trend indicates ${plot.stress === 'severe' ? 'sharp decline' : 'stable canopy cover'}.`;

  const prompt = `You are Kisan Sarthi, an advanced agricultural AI intelligence advisor for Indian farmers.
Generate a structured crop health and advisory report based on the following real-time satellite telemetry and local weather data.

IMPORTANT: You MUST write ALL text values in ${responseLang}. Do NOT use any other language.

Farmer Name: ${plot.farmer}
District: ${plot.district}, Maharashtra
Crop: ${plot.crop} (${plot.acres} acres)
Current NDVI: ${plot.ndvi}
Current NDWI (Water Index): ${plot.ndwi}
Growth Stage: ${growthStage}
Weather Forecast: ${weatherForecast}
Rain Forecast: ${rainForecast}
Heat Risk: ${heatRisk}
Pest Risk: ${pestRisk}
Market Price Context: ${marketPrice}
Historical NDVI Trend: ${historicalNDVI}

You MUST return a JSON object with exactly the following keys (do not include markdown block wrappers, return ONLY the raw JSON string). ALL values must be written in ${responseLang}:

{
  "cropHealthStatus": "Short 2-3 word status (e.g. Healthy, Mild Moisture Stress, Severe Pest Infestation)",
  "confidenceScore": integer between 85 and 98 reflecting satellite analysis confidence,
  "primaryIssue": "Single sentence identifying the core problem",
  "possibleCauses": "Brief explanation of factors causing the issue",
  "immediateActions": ["Action 1 (with product/dose)", "Action 2 (specific timing)", "Action 3 (irrigation/general)"],
  "weatherImpact": "How the upcoming weather affects the crop over the next 7 days",
  "expectedYieldImpact": "Estimated yield loss % if untreated (e.g. '12-15% loss' or 'Minimal')",
  "marketRecommendation": "Actionable selling/holding advice (e.g., Hold crop for better rates, sell immediately)",
  "nextFollowUpDate": "Specific follow-up date (e.g., June 18, 2026)"
}`;

  const responseText = await callGemini(prompt);
  try {
    const cleanText = responseText.replace(/```json/i, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Failed to parse structured advisory:", err, responseText);
    return {
      cropHealthStatus: plot.stress === 'healthy' ? 'Healthy Fasal' : 'Stress Detected',
      confidenceScore: 90,
      primaryIssue: "Potential stress detected via NDVI readings.",
      possibleCauses: "Seasonal climate variability or water deficit.",
      immediateActions: [
        `Monitor soil moisture in the ${plot.crop} field closely.`,
        "Implement micro-irrigation or light watering during evening hours.",
        "Check local APMC for current prices before selling."
      ],
      weatherImpact: "High afternoon temperatures may accelerate water transpiration.",
      expectedYieldImpact: plot.stress === 'severe' ? '20-25% loss' : 'Minimal',
      marketRecommendation: "Review local market trends; prepare harvesting schedule.",
      nextFollowUpDate: "Within 7 days"
    };
  }
}

/**
 * Generates a batch advisory for the advisory screen.
 *
 * @param {import("../data/seedData").Plot} plot - The plot/farmer data
 * @returns {Promise<string>} Advisory text
 */
export async function generateBatchAdvisory(plot) {
  const prompt = `Advisory for ${plot.farmer}, ${plot.district}: Crop ${plot.crop}, NDVI ${plot.ndvi}, NDWI ${plot.ndwi}, Stress: ${plot.stress}
Write:
ADVISORY: 2 sentences (casual English with Hindi crop words)
ACTION: product + dose + timing
RISK: yield loss % if untreated`;

  return callGemini(prompt);
}

/**
 * Generates AI improvement tips for the benchmark screen.
 *
 * @param {import("../data/seedData").Plot} plot
 * @param {string} avg - District average NDVI
 * @param {number} rank - Farmer's rank in district
 * @param {number} total - Total farmers in district
 * @returns {Promise<string>} Tips text
 */
export async function generateImprovementTips(plot, avg, rank, total) {
  const prompt = `Farmer ${plot.farmer}, ${plot.crop} in ${plot.district}. NDVI: ${plot.ndvi}, district avg: ${avg}, rank: #${rank}/${total}. Give 3 specific improvement tips starting each with ✦`;

  return callGemini(prompt);
}

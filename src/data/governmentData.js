import { D } from './seedData';
import { DISTRICTS } from './districts';
import { CROPS } from './crops';

/**
 * State-level aggregated metrics for Maharashtra.
 * Consumed by the Government dashboard.
 */
export const STATE_METRICS = {
  totalFarmers: 2847,
  totalHectares: 18420,
  avgNDVI: 0.52,
  activeAlerts: 7,
  subsidyDisbursed: 342.5, // in crores
  pmfbyCoverage: 68.4, // percentage
  cropDiversityIndex: 0.73,
  irrigationCoverage: 41.2,
};

/**
 * District-level rankings with detailed metrics.
 */
export const DISTRICT_RANKINGS = DISTRICTS.map((d, i) => {
  const districtPlots = D.plots.filter(p => p.district === d.name);
  const avgNdvi = districtPlots.length
    ? +(districtPlots.reduce((s, p) => s + p.ndvi, 0) / districtPlots.length).toFixed(3)
    : 0;
  const stressedCount = districtPlots.filter(p => p.stress !== 'healthy').length;

  return {
    rank: i + 1,
    district: d.name,
    lat: d.lat,
    lon: d.lon,
    farmerCount: Math.floor(400 + Math.random() * 600),
    hectares: Math.floor(2800 + Math.random() * 4000),
    avgNdvi,
    stressedFarms: stressedCount,
    totalFarms: districtPlots.length,
    cropHealth: avgNdvi > 0.5 ? 'good' : avgNdvi > 0.3 ? 'moderate' : 'poor',
    subsidyUtilization: +(55 + Math.random() * 40).toFixed(1),
    pmfbyEnrolled: Math.floor(200 + Math.random() * 500),
    irrigationType: ['Canal', 'Borewell', 'Rainfed', 'Drip', 'Sprinkler'][i % 5],
  };
});

/**
 * Pest outbreak records for monitoring.
 */
export const PEST_OUTBREAKS = [
  {
    id: 1,
    pest: 'Cotton Bollworm',
    district: 'Solapur',
    severity: 'critical',
    affectedArea: 1240,
    farmersAffected: 23,
    detectedDate: '2026-06-08',
    status: 'active',
    response: 'Spray advisory issued. Field teams deployed.',
  },
  {
    id: 2,
    pest: 'Fall Armyworm',
    district: 'Nashik',
    severity: 'warning',
    affectedArea: 680,
    farmersAffected: 11,
    detectedDate: '2026-06-05',
    status: 'monitoring',
    response: 'Pheromone traps distributed. Monitoring in progress.',
  },
  {
    id: 3,
    pest: 'Whitefly',
    district: 'Aurangabad',
    severity: 'moderate',
    affectedArea: 420,
    farmersAffected: 8,
    detectedDate: '2026-06-02',
    status: 'contained',
    response: 'Neem oil spray completed. Situation stabilizing.',
  },
  {
    id: 4,
    pest: 'Thrips',
    district: 'Pune',
    severity: 'low',
    affectedArea: 180,
    farmersAffected: 4,
    detectedDate: '2026-05-28',
    status: 'resolved',
    response: 'Bio-control agents released. No further spread.',
  },
];

/**
 * Subsidy program tracking data.
 */
export const SUBSIDY_PROGRAMS = [
  {
    name: 'PM-KISAN',
    totalBeneficiaries: 1842,
    disbursed: 112.4,
    pending: 23.8,
    rejections: 47,
    completionRate: 82.5,
  },
  {
    name: 'PMFBY',
    totalBeneficiaries: 1247,
    disbursed: 89.2,
    pending: 34.1,
    rejections: 31,
    completionRate: 71.2,
  },
  {
    name: 'Soil Health Card',
    totalBeneficiaries: 2103,
    disbursed: 18.7,
    pending: 5.2,
    rejections: 12,
    completionRate: 91.8,
  },
  {
    name: 'Drip Irrigation Subsidy',
    totalBeneficiaries: 634,
    disbursed: 45.3,
    pending: 12.9,
    rejections: 28,
    completionRate: 76.4,
  },
  {
    name: 'Crop Insurance',
    totalBeneficiaries: 978,
    disbursed: 76.9,
    pending: 18.4,
    rejections: 19,
    completionRate: 80.7,
  },
];

/**
 * Monthly trend data for state-level charts.
 */
export const MONTHLY_TRENDS = [
  { month: 'Jan', ndvi: 0.38, rainfall: 12, alerts: 2, subsidies: 28.4 },
  { month: 'Feb', ndvi: 0.42, rainfall: 8, alerts: 1, subsidies: 31.2 },
  { month: 'Mar', ndvi: 0.48, rainfall: 15, alerts: 3, subsidies: 42.8 },
  { month: 'Apr', ndvi: 0.55, rainfall: 22, alerts: 2, subsidies: 38.5 },
  { month: 'May', ndvi: 0.51, rainfall: 45, alerts: 5, subsidies: 52.1 },
  { month: 'Jun', ndvi: 0.52, rainfall: 120, alerts: 7, subsidies: 48.3 },
];

/**
 * Crop-wise area distribution across the state.
 */
export const CROP_DISTRIBUTION = CROPS.map((crop, i) => ({
  crop,
  area: [4200, 3800, 3100, 2900, 4420][i],
  production: [8400, 11400, 6820, 2320, 26520][i],
  yield: [2.0, 3.0, 2.2, 0.8, 6.0][i],
  msp: [2275, 1200, 2183, 6620, 315][i],
}));

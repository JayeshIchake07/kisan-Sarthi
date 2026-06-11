import { D } from './seedData';
import { calcScore } from '../utils/scoringUtils';

/**
 * Loan application statuses for pipeline management.
 */
const STATUSES = ['new', 'review', 'approved', 'disbursed', 'rejected'];

/**
 * Generate loan pipeline entries from existing farmer data.
 */
export const LOAN_PIPELINE = D.plots.map((plot, i) => {
  const scoreData = calcScore(plot.id, D.hist);
  const score = scoreData?.score || 50;
  const status = STATUSES[i % 5];

  return {
    id: `LOAN-${String(plot.id).padStart(4, '0')}`,
    farmerId: plot.id,
    farmerName: plot.farmer,
    district: plot.district,
    crop: plot.crop,
    acres: plot.acres,
    loanAmount: Math.floor(plot.acres * 25000 + 15000),
    status,
    score,
    riskLevel: score >= 70 ? 'low' : score >= 45 ? 'medium' : 'high',
    appliedDate: `2026-${String(5 + (i % 2)).padStart(2, '0')}-${String(1 + (i * 3) % 28).padStart(2, '0')}`,
    ndvi: plot.ndvi,
    stress: plot.stress,
    consistency: scoreData?.con || 0,
    health: scoreData?.hlt || 0,
    trend: scoreData?.trn || 0,
    repaymentHistory: score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
    previousLoans: Math.floor(i / 4),
    collateral: plot.acres >= 2 ? 'land' : 'crop',
  };
});

/**
 * Portfolio summary metrics for the bank.
 */
export const PORTFOLIO_SUMMARY = {
  totalApplications: LOAN_PIPELINE.length,
  totalDisbursed: LOAN_PIPELINE.filter(l => l.status === 'disbursed')
    .reduce((s, l) => s + l.loanAmount, 0),
  avgScore: Math.round(
    LOAN_PIPELINE.reduce((s, l) => s + l.score, 0) / LOAN_PIPELINE.length
  ),
  approvalRate: +(
    (LOAN_PIPELINE.filter(l => ['approved', 'disbursed'].includes(l.status)).length /
      LOAN_PIPELINE.length) *
    100
  ).toFixed(1),
  npaRisk: +(LOAN_PIPELINE.filter(l => l.riskLevel === 'high').length /
    LOAN_PIPELINE.length * 100).toFixed(1),
  pendingReview: LOAN_PIPELINE.filter(l => l.status === 'review').length,
  newApplications: LOAN_PIPELINE.filter(l => l.status === 'new').length,
};

/**
 * Risk distribution for portfolio analytics.
 */
export const RISK_DISTRIBUTION = [
  { level: 'Low Risk', count: LOAN_PIPELINE.filter(l => l.riskLevel === 'low').length, color: '#10b981' },
  { level: 'Medium Risk', count: LOAN_PIPELINE.filter(l => l.riskLevel === 'medium').length, color: '#f59e0b' },
  { level: 'High Risk', count: LOAN_PIPELINE.filter(l => l.riskLevel === 'high').length, color: '#ef4444' },
];

/**
 * Crop-wise loan exposure data.
 */
export const CROP_EXPOSURE = [...new Set(LOAN_PIPELINE.map(l => l.crop))].map(crop => {
  const loans = LOAN_PIPELINE.filter(l => l.crop === crop);
  return {
    crop,
    totalLoans: loans.length,
    totalAmount: loans.reduce((s, l) => s + l.loanAmount, 0),
    avgScore: Math.round(loans.reduce((s, l) => s + l.score, 0) / loans.length),
    highRiskCount: loans.filter(l => l.riskLevel === 'high').length,
  };
});

/**
 * Monthly disbursement trend.
 */
export const DISBURSEMENT_TREND = [
  { month: 'Jan', amount: 245000, count: 3 },
  { month: 'Feb', amount: 312000, count: 4 },
  { month: 'Mar', amount: 189000, count: 2 },
  { month: 'Apr', amount: 478000, count: 5 },
  { month: 'May', amount: 356000, count: 4 },
  { month: 'Jun', amount: 421000, count: 5 },
];

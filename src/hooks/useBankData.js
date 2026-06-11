import { useMemo, useState, useCallback } from 'react';
import { LOAN_PIPELINE, PORTFOLIO_SUMMARY, RISK_DISTRIBUTION, CROP_EXPOSURE, DISBURSEMENT_TREND } from '@/data/bankData';
import { D } from '@/data/seedData';

/**
 * Hook aggregating scoring + plot data for bank pipeline views.
 * Provides filtering, sorting, and summary analytics.
 */
export function useBankData(filters = {}) {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const { status, riskLevel, district, crop } = filters;

  const filteredPipeline = useMemo(() => {
    let pipeline = LOAN_PIPELINE;
    if (status) pipeline = pipeline.filter(l => l.status === status);
    if (riskLevel) pipeline = pipeline.filter(l => l.riskLevel === riskLevel);
    if (district) pipeline = pipeline.filter(l => l.district === district);
    if (crop) pipeline = pipeline.filter(l => l.crop === crop);
    return pipeline;
  }, [status, riskLevel, district, crop]);

  const pipelineByStatus = useMemo(() => ({
    new: LOAN_PIPELINE.filter(l => l.status === 'new'),
    review: LOAN_PIPELINE.filter(l => l.status === 'review'),
    approved: LOAN_PIPELINE.filter(l => l.status === 'approved'),
    disbursed: LOAN_PIPELINE.filter(l => l.status === 'disbursed'),
    rejected: LOAN_PIPELINE.filter(l => l.status === 'rejected'),
  }), []);

  const getApplicantDetails = useCallback((loanId) => {
    const loan = LOAN_PIPELINE.find(l => l.id === loanId);
    if (!loan) return null;

    const plot = D.plots.find(p => p.id === loan.farmerId);
    const history = D.hist[loan.farmerId] || [];

    return { ...loan, plot, ndviHistory: history };
  }, []);

  return {
    pipeline: filteredPipeline,
    pipelineByStatus,
    portfolioSummary: PORTFOLIO_SUMMARY,
    riskDistribution: RISK_DISTRIBUTION,
    cropExposure: CROP_EXPOSURE,
    disbursementTrend: DISBURSEMENT_TREND,
    selectedLoan,
    setSelectedLoan,
    getApplicantDetails,
  };
}

import { useMemo } from 'react';
import { D } from '@/data/seedData';
import { DISTRICT_RANKINGS, STATE_METRICS, PEST_OUTBREAKS, SUBSIDY_PROGRAMS, MONTHLY_TRENDS, CROP_DISTRIBUTION } from '@/data/governmentData';
import { DISTRICTS } from '@/data/districts';

/**
 * Hook aggregating plot/market/climate data for government-level views.
 * Provides district-level and state-level analytics.
 */
export function useGovernmentData(filters = {}) {
  const { district, crop } = filters;

  const filteredPlots = useMemo(() => {
    let plots = D.plots;
    if (district) plots = plots.filter(p => p.district === district);
    if (crop) plots = plots.filter(p => p.crop === crop);
    return plots;
  }, [district, crop]);

  const districtStats = useMemo(() => {
    return DISTRICTS.map(d => {
      const dPlots = filteredPlots.filter(p => p.district === d.name);
      return {
        name: d.name,
        lat: d.lat,
        lon: d.lon,
        farmerCount: dPlots.length,
        avgNdvi: dPlots.length
          ? +(dPlots.reduce((s, p) => s + p.ndvi, 0) / dPlots.length).toFixed(3)
          : 0,
        stressedCount: dPlots.filter(p => p.stress !== 'healthy').length,
        healthyCount: dPlots.filter(p => p.stress === 'healthy').length,
      };
    });
  }, [filteredPlots]);

  const overallStats = useMemo(() => ({
    totalFarmers: filteredPlots.length,
    avgNdvi: filteredPlots.length
      ? +(filteredPlots.reduce((s, p) => s + p.ndvi, 0) / filteredPlots.length).toFixed(3)
      : 0,
    stressedCount: filteredPlots.filter(p => p.stress !== 'healthy').length,
    healthyPct: filteredPlots.length
      ? +((filteredPlots.filter(p => p.stress === 'healthy').length / filteredPlots.length) * 100).toFixed(1)
      : 0,
  }), [filteredPlots]);

  return {
    plots: filteredPlots,
    districtStats,
    overallStats,
    stateMetrics: STATE_METRICS,
    districtRankings: DISTRICT_RANKINGS,
    pestOutbreaks: PEST_OUTBREAKS,
    subsidyPrograms: SUBSIDY_PROGRAMS,
    monthlyTrends: MONTHLY_TRENDS,
    cropDistribution: CROP_DISTRIBUTION,
    districts: DISTRICTS,
  };
}

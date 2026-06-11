import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGovernmentData } from '@/hooks/useGovernmentData';
import { useClimateAlerts } from '@/hooks/useClimateAlerts';
import { D } from '@/data/seedData';
import { DISTRICTS } from '@/data/districts';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import MetricCard from '../shared/MetricCard';
import ChartCard from '../shared/ChartCard';
import { Users, Leaf, Sprout, Shield, Target, IndianRupee, Activity, Globe } from '../shared/icons';

const AdminMap = lazy(() => import('../admin/AdminMap'));

/**
 * Maharashtra Overview — statewide satellite map, key metrics, trend charts.
 */
export default function MaharashtraOverview() {
  const { stateMetrics, districtStats, monthlyTrends } = useGovernmentData();
  const { alerts } = useClimateAlerts();

  const stressData = [
    { name: 'Healthy', value: D.plots.filter(p => p.stress === 'healthy').length, color: colors.success },
    { name: 'Mild', value: D.plots.filter(p => p.stress === 'mild').length, color: colors.warning },
    { name: 'Severe', value: D.plots.filter(p => p.stress === 'severe').length, color: colors.danger },
  ];

  const districtData = DISTRICTS.map(d => {
    const plots = D.plots.filter(p => p.district === d.name);
    return {
      name: d.name,
      avgNdvi: plots.length ? +(plots.reduce((s, p) => s + p.ndvi, 0) / plots.length).toFixed(3) : 0,
      farmerCount: plots.length,
    };
  });

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Key Metrics */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon={Users} label="Total Farmers" value={stateMetrics.totalFarmers} trend={8.5} color={colors.primary} />
        <MetricCard icon={Globe} label="Total Hectares" value={stateMetrics.totalHectares} trend={3.2} color={colors.success} />
        <MetricCard icon={Leaf} label="Avg NDVI" value={stateMetrics.avgNDVI} decimals={2} trend={2.1} color={colors.success} />
        <MetricCard icon={Shield} label="PMFBY Coverage" value={stateMetrics.pmfbyCoverage} suffix="%" decimals={1} color={colors.info} />
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon={IndianRupee} label="Subsidy Disbursed" value={stateMetrics.subsidyDisbursed} prefix="₹" suffix="Cr" decimals={1} trend={12.3} color={colors.warning} compact />
        <MetricCard icon={Activity} label="Active Alerts" value={stateMetrics.activeAlerts} color={colors.danger} compact />
        <MetricCard icon={Sprout} label="Crop Diversity" value={stateMetrics.cropDiversityIndex} decimals={2} color={colors.primary} compact />
        <MetricCard icon={Target} label="Irrigation" value={stateMetrics.irrigationCoverage} suffix="%" decimals={1} trend={4.1} color={colors.info} compact />
      </div>

      {/* Satellite Map — Central State Intelligence Console */}
      <motion.div variants={staggerItem} style={{ marginBottom: '1.5rem' }}>
        <div style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <h3 style={{ fontSize: typography.base, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily }}>
              Maharashtra Agricultural Satellite Console
            </h3>
            <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: '2px 0 0', fontFamily: typography.fontFamily }}>
              District-level farm clusters, environmental risk zones & live field boundaries
            </p>
          </div>

          <Suspense fallback={
            <div style={{
              height: '620px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: colors.bgLight, borderRadius: '12px', border: `1px solid ${colors.border}`,
              color: colors.textSecondary, fontSize: typography.xs, fontFamily: typography.fontFamily
            }}>
              Loading satellite intelligence layer...
            </div>
          }>
            <AdminMap
              selectedFarm={null}
              onSelectFarm={() => {}}
              alerts={alerts}
              stressData={stressData}
              districtData={districtData}
            />
          </Suspense>
        </div>
      </motion.div>

      {/* NDVI Trend */}
      <motion.div variants={staggerItem}>
        <ChartCard title="Statewide NDVI Trend" subtitle="Monthly average across all districts" height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
              <Line type="monotone" dataKey="ndvi" stroke={colors.success} strokeWidth={2} dot={{ fill: colors.success, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>
    </motion.div>
  );
}

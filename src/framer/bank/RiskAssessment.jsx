import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useBankData } from '@/hooks/useBankData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import MetricCard from '../shared/MetricCard';
import DataTable from '../shared/DataTable';
import StatusBadge from '../shared/StatusBadge';
import { Shield, AlertTriangle, Target, Activity } from '../shared/icons';

/**
 * Risk Assessment — score breakdown, risk matrix, portfolio risk.
 */
export default function RiskAssessment() {
  const { pipeline, riskDistribution, portfolioSummary } = useBankData();

  const columns = [
    { key: 'id', label: 'Loan ID' },
    { key: 'farmerName', label: 'Farmer' },
    { key: 'crop', label: 'Crop' },
    { key: 'score', label: 'Score', align: 'right', render: (v) => (
      <span style={{
        fontWeight: typography.bold,
        color: v >= 70 ? colors.success : v >= 45 ? colors.warning : colors.danger,
      }}>
        {v}
      </span>
    )},
    { key: 'riskLevel', label: 'Risk', render: (v) => <StatusBadge status={v} size="sm" /> },
    { key: 'consistency', label: 'Consistency', align: 'right' },
    { key: 'health', label: 'Health', align: 'right' },
    { key: 'trend', label: 'Trend', align: 'right' },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Summary */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon={Shield} label="Avg Score" value={portfolioSummary.avgScore} color={colors.info} />
        <MetricCard icon={AlertTriangle} label="NPA Risk" value={portfolioSummary.npaRisk} suffix="%" decimals={1} color={colors.danger} />
        <MetricCard icon={Target} label="Approval Rate" value={portfolioSummary.approvalRate} suffix="%" decimals={1} color={colors.success} />
        <MetricCard icon={Activity} label="High Risk" value={riskDistribution.find(r => r.level === 'High Risk')?.count || 0} color={colors.danger} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Risk Distribution Pie */}
        <FramerCard>
          <h3 style={{
            fontSize: typography.base, fontWeight: typography.semibold,
            color: colors.textPrimary, margin: '0 0 16px', fontFamily: typography.fontFamily,
          }}>
            Risk Distribution
          </h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={4} dataKey="count" nameKey="level"
                >
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {riskDistribution.map(r => (
              <div key={r.level} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: typography.xs, color: colors.textSecondary, fontFamily: typography.fontFamily,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                {r.level} ({r.count})
              </div>
            ))}
          </div>
        </FramerCard>

        {/* Score Histogram */}
        <FramerCard>
          <h3 style={{
            fontSize: typography.base, fontWeight: typography.semibold,
            color: colors.textPrimary, margin: '0 0 16px', fontFamily: typography.fontFamily,
          }}>
            Score Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { range: '80-100', color: colors.success },
              { range: '60-79', color: colors.primary },
              { range: '40-59', color: colors.warning },
              { range: '0-39', color: colors.danger },
            ].map((bucket) => {
              const [min, max] = bucket.range.split('-').map(Number);
              const count = pipeline.filter(l => l.score >= min && l.score <= max).length;
              const pct = (count / pipeline.length) * 100;
              return (
                <div key={bucket.range} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: 50, fontSize: typography.xs, color: colors.textMuted,
                    fontFamily: typography.fontFamily, textAlign: 'right',
                  }}>
                    {bucket.range}
                  </span>
                  <div style={{ flex: 1, height: 10, background: colors.bgLighter, borderRadius: 5, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      style={{ height: '100%', borderRadius: 5, background: bucket.color }}
                    />
                  </div>
                  <span style={{
                    width: 24, fontSize: typography.xs, fontWeight: typography.semibold,
                    color: colors.textPrimary, fontFamily: typography.fontFamily,
                  }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </FramerCard>
      </div>

      {/* Risk Table */}
      <motion.div variants={staggerItem}>
        <DataTable columns={columns} data={pipeline} maxHeight="400px" />
      </motion.div>
    </motion.div>
  );
}

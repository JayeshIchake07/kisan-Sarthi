import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGovernmentData } from '@/hooks/useGovernmentData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import ChartCard from '../shared/ChartCard';
import MetricCard from '../shared/MetricCard';
import AnimatedCounter from '../shared/AnimatedCounter';
import { IndianRupee, Users, Target, Shield, FileCheck } from '../shared/icons';

/**
 * Subsidy Intelligence — PMFBY monitoring, subsidy targeting, disbursement tracking.
 */
export default function SubsidyIntelligence() {
  const { subsidyPrograms, stateMetrics } = useGovernmentData();

  const chartData = subsidyPrograms.map(s => ({
    name: s.name,
    disbursed: s.disbursed,
    pending: s.pending,
  }));

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Summary */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon={IndianRupee} label="Total Disbursed" value={stateMetrics.subsidyDisbursed} prefix="₹" suffix="Cr" decimals={1} trend={12.3} color={colors.success} />
        <MetricCard icon={Users} label="Beneficiaries" value={6804} trend={7.8} color={colors.primary} />
        <MetricCard icon={Shield} label="PMFBY Coverage" value={stateMetrics.pmfbyCoverage} suffix="%" decimals={1} color={colors.info} />
        <MetricCard icon={Target} label="Targeting Accuracy" value={87.4} suffix="%" decimals={1} trend={2.1} color={colors.success} />
      </div>

      {/* Disbursement Chart */}
      <ChartCard
        title="Subsidy Disbursement by Program"
        subtitle="Disbursed vs Pending (₹ Crore)"
        height={220}
        style={{ marginBottom: '1.5rem' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
            <Bar dataKey="disbursed" name="Disbursed" fill={colors.success} radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill={colors.warning} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Program Details */}
      {subsidyPrograms.map((program, i) => (
        <motion.div key={i} variants={staggerItem} style={{ marginBottom: '12px' }}>
          <FramerCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileCheck size={20} color={colors.primary} />
                <h3 style={{
                  fontSize: typography.base, fontWeight: typography.semibold,
                  color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
                }}>
                  {program.name}
                </h3>
              </div>
              <span style={{
                fontSize: typography.sm, fontWeight: typography.bold,
                color: colors.success, fontFamily: typography.fontFamily,
              }}>
                {program.completionRate}% Complete
              </span>
            </div>

            {/* Progress bar */}
            <div style={{
              height: 8, background: colors.bgLighter, borderRadius: 4,
              overflow: 'hidden', marginBottom: '14px',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${program.completionRate}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                style={{
                  height: '100%', borderRadius: 4,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.success})`,
                }}
              />
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
            }}>
              {[
                { label: 'Beneficiaries', value: program.totalBeneficiaries.toLocaleString('en-IN') },
                { label: 'Disbursed', value: `₹${program.disbursed}Cr` },
                { label: 'Pending', value: `₹${program.pending}Cr` },
                { label: 'Rejections', value: program.rejections },
              ].map((item, j) => (
                <div key={j} style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: typography.xs, color: colors.textMuted, margin: '0 0 4px',
                    fontFamily: typography.fontFamily,
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontSize: typography.sm, fontWeight: typography.semibold,
                    color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
                  }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </FramerCard>
        </motion.div>
      ))}
    </motion.div>
  );
}

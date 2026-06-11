import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useBankData } from '@/hooks/useBankData';
import { CROP_COLORS } from '@/data/crops';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import MetricCard from '../shared/MetricCard';
import ChartCard from '../shared/ChartCard';
import FramerCard from '../shared/FramerCard';
import AnimatedCounter from '../shared/AnimatedCounter';
import { IndianRupee, TrendingUp, Shield, BarChart3, AlertTriangle, Target } from '../shared/icons';

/**
 * Portfolio Analytics — distribution, NPA risk, crop-wise exposure.
 */
export default function PortfolioAnalytics() {
  const { portfolioSummary, riskDistribution, cropExposure, disbursementTrend } = useBankData();

  const cropPieData = cropExposure.map(c => ({
    name: c.crop,
    value: c.totalAmount,
    color: CROP_COLORS[c.crop] || colors.primary,
  }));

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Portfolio Summary */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon={IndianRupee} label="Total Disbursed" value={portfolioSummary.totalDisbursed} prefix="₹" color={colors.success} />
        <MetricCard icon={BarChart3} label="Applications" value={portfolioSummary.totalApplications} color={colors.info} />
        <MetricCard icon={Shield} label="Avg Score" value={portfolioSummary.avgScore} color={colors.primary} />
        <MetricCard icon={AlertTriangle} label="NPA Risk" value={portfolioSummary.npaRisk} suffix="%" decimals={1} color={colors.danger} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Crop Exposure Pie */}
        <ChartCard title="Crop-wise Exposure" subtitle="Loan amount by crop type" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={cropPieData} cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3} dataKey="value" nameKey="name">
                {cropPieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', position: 'absolute', bottom: '12px', left: 0, right: 0 }}>
            {cropPieData.map(c => (
              <div key={c.name} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: typography.xs, color: colors.textSecondary, fontFamily: typography.fontFamily,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Disbursement Trend */}
        <ChartCard title="Monthly Disbursement" subtitle="Loan disbursement trend" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={disbursementTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: colors.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }}
              />
              <Bar dataKey="amount" name="Amount" fill={colors.info} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Crop Exposure Detail Cards */}
      <motion.div variants={staggerItem}>
        <h3 style={{
          fontSize: typography.base, fontWeight: typography.semibold,
          color: colors.textPrimary, margin: '0 0 12px', fontFamily: typography.fontFamily,
        }}>
          Crop-wise Risk Analysis
        </h3>
        <div className="grid-auto">
          {cropExposure.map((crop, i) => (
            <FramerCard key={crop.crop} delay={i * 0.05}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px',
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: CROP_COLORS[crop.crop] || colors.primary,
                }} />
                <h4 style={{
                  fontSize: typography.base, fontWeight: typography.semibold,
                  color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
                }}>
                  {crop.crop}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Loans', value: crop.totalLoans },
                  { label: 'Exposure', value: `₹${(crop.totalAmount / 1000).toFixed(0)}K` },
                  { label: 'Avg Score', value: crop.avgScore },
                  { label: 'High Risk', value: crop.highRiskCount },
                ].map((item, j) => (
                  <div key={j} style={{ textAlign: 'center' }}>
                    <p style={{
                      fontSize: typography.xs, color: colors.textMuted, margin: '0 0 2px',
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
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

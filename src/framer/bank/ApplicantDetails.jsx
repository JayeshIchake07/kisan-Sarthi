import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useBankData } from '@/hooks/useBankData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import ChartCard from '../shared/ChartCard';
import StatusBadge from '../shared/StatusBadge';
import { User, MapPin, Sprout, FileText, Shield } from '../shared/icons';

const ApplicantFarmMap = lazy(() => import('./ApplicantFarmMap'));

/**
 * Applicant Details — farmer profile, NDVI history chart, loan info.
 */
export default function ApplicantDetails() {
  const { pipeline, getApplicantDetails } = useBankData();
  const [selectedId, setSelectedId] = useState(pipeline[0]?.id);
  const details = getApplicantDetails(selectedId);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        {/* Applicant List */}
        <motion.div variants={staggerItem}>
          <FramerCard padding="0" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            {pipeline.map((loan, i) => (
              <motion.div
                key={loan.id}
                onClick={() => setSelectedId(loan.id)}
                whileHover={{ background: colors.bgLighter }}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: `1px solid ${colors.borderLight}`,
                  background: selectedId === loan.id ? colors.bgLighter : 'transparent',
                  borderLeft: selectedId === loan.id ? `3px solid ${colors.info}` : '3px solid transparent',
                }}
              >
                <div style={{
                  fontSize: typography.sm, fontWeight: typography.medium,
                  color: colors.textPrimary, fontFamily: typography.fontFamily,
                }}>
                  {loan.farmerName}
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginTop: '4px',
                  fontSize: typography.xs, color: colors.textMuted, fontFamily: typography.fontFamily,
                }}>
                  <span>{loan.id}</span>
                  <StatusBadge status={loan.riskLevel} size="sm" />
                </div>
              </motion.div>
            ))}
          </FramerCard>
        </motion.div>

        {/* Details Panel */}
        {details && (
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Farmer Profile */}
            <FramerCard glowing style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '14px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: typography.xl, fontWeight: typography.bold,
                  color: '#fff', fontFamily: typography.fontFamily,
                }}>
                  {details.plot?.initials}
                </div>
                <div>
                  <h2 style={{
                    fontSize: typography.lg, fontWeight: typography.bold,
                    color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
                  }}>
                    {details.farmerName}
                  </h2>
                  <p style={{
                    fontSize: typography.sm, color: colors.textMuted, margin: '2px 0 0',
                    fontFamily: typography.fontFamily,
                  }}>
                    {details.id} · Applied: {details.appliedDate}
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <StatusBadge status={details.status} size="md" />
                  <StatusBadge status={details.riskLevel} size="md" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { icon: MapPin, label: 'District', value: details.district },
                  { icon: Sprout, label: 'Crop', value: `${details.crop} · ${details.acres}ac` },
                  { icon: FileText, label: 'Loan Amount', value: `₹${details.loanAmount.toLocaleString('en-IN')}` },
                  { icon: Shield, label: 'Score', value: details.score },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: colors.bgLighter, borderRadius: '10px', padding: '10px',
                    textAlign: 'center',
                  }}>
                    <item.icon size={16} color={colors.textMuted} style={{ marginBottom: '4px' }} />
                    <p style={{
                      fontSize: typography.xs, color: colors.textMuted, margin: '4px 0 2px',
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

            {/* Split Charts & Map Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
              {/* NDVI History */}
              <ChartCard
                title="NDVI History"
                subtitle="Satellite-based vegetation index over time"
                height={200}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={details.ndviHistory?.map(h => ({ ...h, label: `D-${h.day}` }))}>
                    <defs>
                      <linearGradient id="bankNdviGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.success} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={colors.success} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: colors.textDim }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: colors.textDim }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
                    <Area type="monotone" dataKey="ndvi" stroke={colors.success} strokeWidth={2} fill="url(#bankNdviGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Satellite Evidence Panel */}
              <FramerCard style={{ height: '264px', overflow: 'hidden' }}>
                <h3 style={{
                  fontSize: typography.base, fontWeight: typography.semibold,
                  color: colors.textPrimary, margin: '0 0 4px', fontFamily: typography.fontFamily,
                }}>
                  Satellite Evidence Panel
                </h3>
                <p style={{
                  fontSize: '11px', color: colors.textMuted, margin: '0 0 12px', fontFamily: typography.fontFamily,
                }}>
                  Interactive crop field boundary & satellite scan
                </p>
                <Suspense fallback={
                  <div style={{
                    height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: colors.bgLight, borderRadius: '12px', border: `1px solid ${colors.border}`,
                    color: colors.textSecondary, fontSize: typography.xs, fontFamily: typography.fontFamily
                  }}>
                    Loading satellite imagery...
                  </div>
                }>
                  <ApplicantFarmMap farm={details.plot} />
                </Suspense>
              </FramerCard>
            </div>

            {/* Loan Details */}
            <FramerCard>
              <h3 style={{
                fontSize: typography.base, fontWeight: typography.semibold,
                color: colors.textPrimary, margin: '0 0 14px', fontFamily: typography.fontFamily,
              }}>
                Assessment Details
              </h3>
              {[
                { label: 'Collateral', value: details.collateral },
                { label: 'Previous Loans', value: details.previousLoans },
                { label: 'Repayment History', value: details.repaymentHistory },
                { label: 'Consistency Score', value: details.consistency },
                { label: 'Health Score', value: details.health },
                { label: 'Trend Score', value: details.trend },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: i < 5 ? `1px solid ${colors.borderLight}` : 'none',
                  fontSize: typography.sm, fontFamily: typography.fontFamily,
                }}>
                  <span style={{ color: colors.textMuted }}>{item.label}</span>
                  <span style={{ color: colors.textPrimary, fontWeight: typography.medium, textTransform: 'capitalize' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </FramerCard>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

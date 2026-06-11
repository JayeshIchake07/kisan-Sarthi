import { motion } from 'framer-motion';
import { useBankData } from '@/hooks/useBankData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import MetricCard from '../shared/MetricCard';
import StatusBadge from '../shared/StatusBadge';
import { FileText, IndianRupee, Shield, Clock, Check, AlertTriangle } from '../shared/icons';

const STATUS_CONFIG = {
  new: { color: colors.info, label: 'New' },
  review: { color: colors.warning, label: 'In Review' },
  approved: { color: colors.success, label: 'Approved' },
  disbursed: { color: colors.primary, label: 'Disbursed' },
  rejected: { color: colors.danger, label: 'Rejected' },
};

/**
 * Loan Pipeline — Kanban-style pipeline view.
 */
export default function LoanPipeline() {
  const { pipelineByStatus, portfolioSummary } = useBankData();

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Summary Metrics */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon={FileText} label="Total Applications" value={portfolioSummary.totalApplications} color={colors.info} />
        <MetricCard icon={Clock} label="Pending Review" value={portfolioSummary.pendingReview} color={colors.warning} />
        <MetricCard icon={Check} label="Approval Rate" value={portfolioSummary.approvalRate} suffix="%" decimals={1} color={colors.success} />
        <MetricCard icon={IndianRupee} label="Total Disbursed" value={portfolioSummary.totalDisbursed} prefix="₹" color={colors.primary} />
      </div>

      {/* Kanban Pipeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        overflowX: 'auto',
      }}>
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const items = pipelineByStatus[status] || [];
          return (
            <motion.div key={status} variants={staggerItem}>
              {/* Column Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', marginBottom: '8px',
                background: `${config.color}10`, borderRadius: '10px',
                border: `1px solid ${config.color}25`,
              }}>
                <span style={{
                  fontSize: typography.xs, fontWeight: typography.semibold,
                  color: config.color, fontFamily: typography.fontFamily,
                  textTransform: 'uppercase', letterSpacing: typography.trackingWide,
                }}>
                  {config.label}
                </span>
                <span style={{
                  width: 22, height: 22, borderRadius: '6px',
                  background: `${config.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: typography.xs, fontWeight: typography.bold,
                  color: config.color, fontFamily: typography.fontFamily,
                }}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((loan, i) => (
                  <motion.div
                    key={loan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    style={{
                      background: colors.bgCard, border: `1px solid ${colors.border}`,
                      borderRadius: '12px', padding: '12px', cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      fontSize: typography.xs, color: colors.textDim,
                      fontFamily: typography.fontFamily, marginBottom: '4px',
                    }}>
                      {loan.id}
                    </div>
                    <div style={{
                      fontSize: typography.sm, fontWeight: typography.medium,
                      color: colors.textPrimary, fontFamily: typography.fontFamily,
                      marginBottom: '6px',
                    }}>
                      {loan.farmerName}
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: typography.xs, color: colors.textMuted,
                      fontFamily: typography.fontFamily,
                    }}>
                      <span>{loan.crop}</span>
                      <span>₹{(loan.loanAmount / 1000).toFixed(0)}K</span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginTop: '8px',
                    }}>
                      <span style={{
                        fontSize: typography.xs,
                        color: loan.score >= 70 ? colors.success : loan.score >= 45 ? colors.warning : colors.danger,
                        fontWeight: typography.semibold, fontFamily: typography.fontFamily,
                      }}>
                        Score: {loan.score}
                      </span>
                      <StatusBadge status={loan.riskLevel} size="sm" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLoanScore } from '@/hooks/useLoanScore';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import AnimatedCounter from '../shared/AnimatedCounter';
import StatusBadge from '../shared/StatusBadge';
import { Shield, ShieldCheck, CreditCard, RefreshCw } from '../shared/icons';

/**
 * Loan Application screen — uses useLoanScore hook with animated score ring.
 */
export default function LoanApplication({ t }) {
  const [plotId, setPlotId] = useState('1');
  const { result, loading, search } = useLoanScore();

  const handleCheck = () => search(plotId);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: typography.lg, fontWeight: typography.bold,
          color: colors.textPrimary, margin: '0 0 4px', fontFamily: typography.fontFamily,
        }}>
          {t('loanScore')}
        </h2>
        <p style={{ fontSize: typography.sm, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
          {t('satelliteLoanEligibility')}
        </p>
      </motion.div>

      {/* Input */}
      <FramerCard style={{ marginBottom: '16px' }}>
        <p style={{
          fontSize: typography.xs, color: colors.textMuted, margin: '0 0 10px',
          fontFamily: typography.fontFamily, textTransform: 'uppercase',
          letterSpacing: typography.trackingWide,
        }}>
          {t('farmerPlotId')}
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            min="1" max="20"
            value={plotId}
            onChange={(e) => setPlotId(e.target.value)}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '12px',
              background: colors.bgLighter, border: `1px solid ${colors.border}`,
              color: colors.textPrimary, fontSize: typography.base,
              fontFamily: typography.fontFamily, outline: 'none',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheck}
            disabled={loading}
            style={{
              padding: '12px 20px', borderRadius: '12px',
              background: colors.primary, border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: typography.sm, fontWeight: typography.semibold,
              fontFamily: typography.fontFamily,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <RefreshCw size={16} />
              </motion.div>
            ) : (
              <>{t('checkScore')}</>
            )}
          </motion.button>
        </div>
      </FramerCard>

      {/* Score Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {/* Score Ring */}
          <FramerCard glowing style={{ marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke={colors.bgLighter} strokeWidth="8" />
                <motion.circle
                  cx="70" cy="70" r="60"
                  fill="none"
                  stroke={result.score >= 70 ? colors.success : result.score >= 45 ? colors.warning : colors.danger}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - result.score / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  transform="rotate(-90 70 70)"
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <AnimatedCounter
                  value={result.score}
                  fontSize={typography['3xl']}
                  color={result.score >= 70 ? colors.success : result.score >= 45 ? colors.warning : colors.danger}
                />
                <span style={{
                  fontSize: typography.xs, color: colors.textMuted,
                  fontFamily: typography.fontFamily, marginTop: '2px',
                }}>
                  / 100
                </span>
              </div>
            </div>

            <StatusBadge
              status={result.score >= 70 ? 'approved' : result.score >= 45 ? 'review' : 'rejected'}
              label={result.score >= 60 ? t('eligible') : t('notEligible')}
              size="lg"
            />

            <p style={{
              fontSize: typography.sm, color: colors.textSecondary, marginTop: '12px',
              fontFamily: typography.fontFamily,
            }}>
              {result.plot.farmer} · {result.plot.crop} · {result.plot.district}
            </p>
          </FramerCard>

          {/* Score Breakdown */}
          <FramerCard style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontSize: typography.sm, fontWeight: typography.semibold,
              color: colors.textMuted, margin: '0 0 14px', fontFamily: typography.fontFamily,
              textTransform: 'uppercase', letterSpacing: typography.trackingWide,
            }}>
              {t('scoreBreakdown')}
            </h3>
            {[
              { label: t('consistency'), value: result.con, weight: '40%' },
              { label: t('health'), value: result.hlt, weight: '40%' },
              { label: t('trend'), value: result.trn, weight: '20%' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? '14px' : 0 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: '6px',
                }}>
                  <span style={{
                    fontSize: typography.sm, color: colors.textSecondary, fontFamily: typography.fontFamily,
                  }}>
                    {item.label}
                    <span style={{ fontSize: typography.xs, color: colors.textDim, marginLeft: '6px' }}>
                      ({item.weight})
                    </span>
                  </span>
                  <span style={{
                    fontSize: typography.sm, fontWeight: typography.semibold,
                    color: colors.textPrimary, fontFamily: typography.fontFamily,
                  }}>
                    {item.value}
                  </span>
                </div>
                <div style={{ height: 6, background: colors.bgLighter, borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.3 + i * 0.2, duration: 0.8 }}
                    style={{
                      height: '100%', borderRadius: 3,
                      background: item.value >= 70 ? colors.success : item.value >= 45 ? colors.warning : colors.danger,
                    }}
                  />
                </div>
              </div>
            ))}
          </FramerCard>

          {/* Loan Eligibility Card */}
          <FramerCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <ShieldCheck size={20} color={result.score >= 60 ? colors.success : colors.danger} />
              <span style={{
                fontSize: typography.base, fontWeight: typography.semibold,
                color: colors.textPrimary, fontFamily: typography.fontFamily,
              }}>
                {result.score >= 60 ? t('loanEligible') : t('needsImprovement')}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: t('maxLoanAmount'), value: `₹${(result.plot.acres * 25000).toLocaleString('en-IN')}` },
                { label: t('interestRate'), value: result.score >= 70 ? '7% p.a.' : '9% p.a.' },
                { label: t('tenure'), value: t('kharifSeason') },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: typography.sm, fontFamily: typography.fontFamily,
                }}>
                  <span style={{ color: colors.textMuted }}>{item.label}</span>
                  <span style={{ color: colors.textPrimary, fontWeight: typography.medium }}>{item.value}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '12px', marginTop: '16px',
                borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: result.score >= 60
                  ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`
                  : colors.bgLighter,
                color: result.score >= 60 ? '#fff' : colors.textMuted,
                fontSize: typography.sm, fontWeight: typography.semibold,
                fontFamily: typography.fontFamily,
              }}
            >
              {result.score >= 60 ? t('applyNow') : t('improveScoreFirst')}
            </motion.button>
          </FramerCard>
        </motion.div>
      )}
    </motion.div>
  );
}

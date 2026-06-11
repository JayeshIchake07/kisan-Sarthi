import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { D } from '@/data/seedData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';

const currentFarmer = D.plots[0];
const ndviHistory = D.hist[currentFarmer.id].map(h => ({ ...h, label: `D-${h.day}` }));

/**
 * Field Health screen — NDVI trend chart, crop stress cards, field details.
 */
export default function FieldHealth({ t }) {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: typography.lg, fontWeight: typography.bold,
          color: colors.textPrimary, margin: '0 0 4px',
          fontFamily: typography.fontFamily,
        }}>
          {t('fieldHealth')}
        </h2>
        <p style={{
          fontSize: typography.sm, color: colors.textMuted, margin: 0,
          fontFamily: typography.fontFamily,
        }}>
          {currentFarmer.farmer} · {currentFarmer.crop} · {currentFarmer.district}
        </p>
      </motion.div>

      {/* NDVI Trend Chart */}
      <FramerCard glowing style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textSecondary, margin: '0 0 12px', fontFamily: typography.fontFamily,
        }}>
          {t('ndviTrend')}
        </h3>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ndviHistory}>
              <defs>
                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.success} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.success} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: colors.bgCard, border: `1px solid ${colors.border}`,
                  borderRadius: '10px', fontSize: '12px', fontFamily: typography.fontFamily,
                }}
              />
              <Area type="monotone" dataKey="ndvi" stroke={colors.success} strokeWidth={2} fill="url(#ndviGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </FramerCard>

      {/* Current Status */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textMuted, margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          {t('fieldDetails')}
        </h3>
        <FramerCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'NDVI', value: currentFarmer.ndvi.toFixed(3), color: currentFarmer.ndvi > 0.4 ? colors.success : colors.warning },
              { label: 'NDWI', value: currentFarmer.ndwi.toFixed(3), color: currentFarmer.ndwi > 0.15 ? colors.info : colors.warning },
              { label: t('cropStress'), value: null, badge: currentFarmer.stress },
              { label: t('acres'), value: currentFarmer.acres },
              { label: 'Sown', value: `${currentFarmer.sowDays} days ago` },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingBottom: i < 4 ? '14px' : 0,
                borderBottom: i < 4 ? `1px solid ${colors.borderLight}` : 'none',
              }}>
                <span style={{
                  fontSize: typography.sm, color: colors.textMuted, fontFamily: typography.fontFamily,
                }}>
                  {item.label}
                </span>
                {item.badge ? (
                  <StatusBadge status={item.badge} />
                ) : (
                  <span style={{
                    fontSize: typography.sm, fontWeight: typography.semibold,
                    color: item.color || colors.textPrimary, fontFamily: typography.fontFamily,
                  }}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </FramerCard>
      </motion.div>

      {/* Stress Distribution */}
      <motion.div variants={staggerItem}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textMuted, margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          All Fields Overview
        </h3>
        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: t('healthy'), count: D.plots.filter(p => p.stress === 'healthy').length, color: colors.success },
            { label: t('mild'), count: D.plots.filter(p => p.stress === 'mild').length, color: colors.warning },
            { label: t('severe'), count: D.plots.filter(p => p.stress === 'severe').length, color: colors.danger },
          ].map((s) => (
            <FramerCard key={s.label} padding="12px">
              <div style={{ textAlign: 'center' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  style={{
                    height: 4, borderRadius: 2, background: s.color,
                    margin: '0 auto 8px',
                  }}
                />
                <p style={{
                  fontSize: typography.xl, fontWeight: typography.bold,
                  color: s.color, margin: 0, fontFamily: typography.fontFamily,
                }}>
                  {s.count}
                </p>
                <p style={{
                  fontSize: typography.xs, color: colors.textMuted, margin: '2px 0 0',
                  fontFamily: typography.fontFamily,
                }}>
                  {s.label}
                </p>
              </div>
            </FramerCard>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

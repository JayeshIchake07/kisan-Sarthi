import { motion } from 'framer-motion';
import { D } from '@/data/seedData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import AnimatedCounter from '../shared/AnimatedCounter';
import { Sun, CloudRain, Leaf, Map, IndianRupee, AlertTriangle, Sprout, ArrowUpRight, Wifi, WifiOff } from '../shared/icons';
import MapPreviewCard from './MapPreviewCard';

const currentFarmer = D.plots[0]; // Demo: Ramesh Patil

/**
 * Farmer Home Dashboard — weather card, NDVI summary, quick actions, alerts preview.
 */
export default function FarmerHome({ t, onNavigate }) {
  const healthyCount = D.plots.filter(p => p.stress === 'healthy').length;
  const stressedCount = D.plots.filter(p => p.stress !== 'healthy').length;
  const isOnline = true; // Demo: always online

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Welcome & Offline indicator */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: typography.sm, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
              {t('welcomeBack')} 👋
            </p>
            <h2 style={{
              fontSize: typography.xl, fontWeight: typography.bold, color: colors.textPrimary,
              margin: '4px 0 0', fontFamily: typography.fontFamily,
            }}>
              {currentFarmer.farmer}
            </h2>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: isOnline ? colors.success : colors.danger,
            fontFamily: typography.fontFamily,
          }}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isOnline ? t('online') : t('offline')}
          </div>
        </div>
      </motion.div>

      {/* Weather card */}
      <FramerCard glowing style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
              {t('todayWeather')} · {currentFarmer.district}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{
                fontSize: typography['3xl'], fontWeight: typography.bold,
                color: colors.textPrimary, fontFamily: typography.fontFamily,
              }}>
                34°C
              </span>
              <span style={{ fontSize: typography.sm, color: colors.textMuted, fontFamily: typography.fontFamily }}>
                {t('partlyCloudy')}
              </span>
            </div>
            <div style={{
              display: 'flex', gap: '16px', marginTop: '8px',
              fontSize: typography.xs, color: colors.textSecondary, fontFamily: typography.fontFamily,
            }}>
              <span>💧 45% {t('humidity')}</span>
              <span>🌬️ 12 km/h {t('wind')}</span>
              <span>🌧️ 20% {t('rainChance')}</span>
            </div>
          </div>
          <Sun size={48} color={colors.warning} strokeWidth={1.5} />
        </div>
      </FramerCard>

      {/* Field Map Preview Card */}
      <MapPreviewCard t={t} onNavigate={onNavigate} />

      {/* NDVI & Crop Status Summary */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textMuted, margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          {t('cropStatus')}
        </h3>
        <div className="grid-2">
          <FramerCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '12px',
                background: `${colors.success}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Leaf size={20} color={colors.success} />
              </div>
              <div>
                <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
                  {t('ndviScore')}
                </p>
                <AnimatedCounter value={currentFarmer.ndvi} decimals={3} fontSize={typography.lg} />
              </div>
            </div>
            <div style={{
              marginTop: '10px', height: 4, background: colors.bgLighter, borderRadius: 2,
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentFarmer.ndvi * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                  height: '100%', borderRadius: 2,
                  background: currentFarmer.ndvi > 0.4 ? colors.success : colors.warning,
                }}
              />
            </div>
          </FramerCard>

          <FramerCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '12px',
                background: `${colors.primary}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sprout size={20} color={colors.primary} />
              </div>
              <div>
                <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
                  {currentFarmer.crop}
                </p>
                <p style={{
                  fontSize: typography.sm, fontWeight: typography.semibold,
                  color: colors.textPrimary, margin: '2px 0 0', fontFamily: typography.fontFamily,
                }}>
                  {currentFarmer.acres} {t('acres')}
                </p>
              </div>
            </div>
            <p style={{
              marginTop: '10px', fontSize: typography.xs, color: colors.textSecondary,
              fontFamily: typography.fontFamily,
            }}>
              {t('sownDaysAgo').replace('{days}', currentFarmer.sowDays)}
            </p>
          </FramerCard>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textMuted, margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          {t('quickActions')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {[
            { id: 'fieldMap', icon: Map, label: t('fieldMap'), color: colors.success },
            { id: 'advisory', icon: Sprout, label: t('advisory'), color: colors.primary },
            { id: 'market', icon: IndianRupee, label: t('market'), color: colors.warning },
            { id: 'loan', icon: IndianRupee, label: t('loan'), color: colors.info },
          ].map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(action.id)}
              style={{
                background: colors.bgCard, border: `1px solid ${colors.border}`,
                borderRadius: '14px', padding: '14px 8px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                fontFamily: typography.fontFamily,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: `${action.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <action.icon size={18} color={action.color} />
              </div>
              <span style={{ fontSize: '0.625rem', color: colors.textSecondary, fontWeight: typography.medium }}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div variants={staggerItem}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{
            fontSize: typography.sm, fontWeight: typography.semibold,
            color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily,
            textTransform: 'uppercase', letterSpacing: typography.trackingWide,
          }}>
            {t('recentAlerts')}
          </h3>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('climate')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: colors.primary, fontSize: typography.xs,
              fontFamily: typography.fontFamily, fontWeight: typography.medium,
              display: 'flex', alignItems: 'center', gap: '2px',
            }}
          >
            {t('viewAll')} <ArrowUpRight size={12} />
          </motion.button>
        </div>

        <FramerCard padding="0">
          {[
            { icon: '🌡️', text: t('heatwaveAlertMsg'), time: '2h ago', sev: 'critical' },
            { icon: '🌧️', text: t('heavyRainAlertMsg'), time: '5h ago', sev: 'warning' },
          ].map((alert, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px',
                borderBottom: i < 1 ? `1px solid ${colors.borderLight}` : 'none',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{alert.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: typography.sm, color: colors.textPrimary, margin: 0,
                  fontFamily: typography.fontFamily, lineHeight: typography.snug,
                }}>
                  {alert.text}
                </p>
                <p style={{
                  fontSize: typography.xs, color: colors.textMuted, margin: '4px 0 0',
                  fontFamily: typography.fontFamily,
                }}>
                  {alert.time}
                </p>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: alert.sev === 'critical' ? colors.danger : colors.warning,
              }} />
            </div>
          ))}
        </FramerCard>
      </motion.div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { useClimateAlerts } from '@/hooks/useClimateAlerts';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';
import { CloudLightning, AlertTriangle, Thermometer, CloudRain, Bug } from '../shared/icons';

const ALERT_ICONS = {
  Heatwave: Thermometer,
  'Heavy Rain': CloudRain,
  'Pest Outbreak': Bug,
};

/**
 * Climate Alerts screen — uses useClimateAlerts hook.
 */
export default function ClimateAlerts({ t }) {
  const { alerts, vulnerabilities, history, loading } = useClimateAlerts();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 0' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="shimmer" style={{ height: 80, borderRadius: '16px' }} />
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: typography.lg, fontWeight: typography.bold,
          color: colors.textPrimary, margin: '0 0 4px', fontFamily: typography.fontFamily,
        }}>
          {t('climateAlerts')}
        </h2>
        <p style={{ fontSize: typography.sm, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
          {t('weatherWarnings')}
        </p>
      </motion.div>

      {/* Active alerts */}
      {alerts.map((alert, i) => {
        const Icon = ALERT_ICONS[alert.type] || AlertTriangle;
        return (
          <motion.div
            key={i}
            variants={staggerItem}
            style={{ marginBottom: '12px' }}
          >
            <FramerCard
              glowing={alert.sev === 'critical'}
              style={{
                borderLeft: `3px solid ${alert.sev === 'critical' ? colors.danger : colors.warning}`,
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: alert.sev === 'critical' ? colors.dangerBg : colors.warningBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={22} color={alert.sev === 'critical' ? colors.danger : colors.warning} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: typography.base, fontWeight: typography.semibold,
                      color: colors.textPrimary, fontFamily: typography.fontFamily,
                    }}>
                      {t(alert.typeKey || alert.type.toLowerCase())}
                    </span>
                    <StatusBadge status={alert.sev} size="sm" pulsing={alert.sev === 'critical'} />
                  </div>
                  <p style={{
                    fontSize: typography.sm, color: colors.textSecondary,
                    margin: '0 0 8px', fontFamily: typography.fontFamily,
                    lineHeight: typography.relaxed,
                  }}>
                    {t(alert.msgKey || alert.msg)}
                  </p>
                  <div style={{
                    display: 'flex', gap: '12px',
                    fontSize: typography.xs, color: colors.textMuted,
                    fontFamily: typography.fontFamily,
                  }}>
                    <span>📍 {alert.district}</span>
                    <span>🌾 {alert.farms} {t('affectedFarms').toLowerCase()}</span>
                  </div>
                </div>
              </div>
            </FramerCard>
          </motion.div>
        );
      })}

      {/* Crop Vulnerability */}
      <motion.div variants={staggerItem} style={{ marginTop: '8px' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textMuted, margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          {t('cropVulnerability')}
        </h3>
        <FramerCard padding="0">
          {vulnerabilities.map((v, i) => (
            <div
              key={v.crop}
              style={{
                display: 'flex', alignItems: 'center', padding: '12px 16px',
                borderBottom: i < vulnerabilities.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
              }}
            >
              <span style={{
                flex: 1, fontSize: typography.sm, color: colors.textPrimary,
                fontFamily: typography.fontFamily, fontWeight: typography.medium,
              }}>
                {v.crop}
              </span>
              <span style={{
                fontSize: typography.xs, color: colors.textMuted, marginRight: '12px',
                fontFamily: typography.fontFamily,
              }}>
                {t(v.stage)}
              </span>
              <div style={{ width: 60, height: 6, background: colors.bgLighter, borderRadius: 3, overflow: 'hidden', marginRight: '8px' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${v.risk}%` }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  style={{
                    height: '100%', borderRadius: 3,
                    background: v.risk > 70 ? colors.danger : v.risk > 50 ? colors.warning : colors.success,
                  }}
                />
              </div>
              <span style={{
                fontSize: typography.sm, fontWeight: typography.semibold,
                color: v.risk > 70 ? colors.danger : v.risk > 50 ? colors.warning : colors.success,
                fontFamily: typography.fontFamily, width: 32, textAlign: 'right',
              }}>
                {v.risk}%
              </span>
            </div>
          ))}
        </FramerCard>
      </motion.div>

      {/* Alert History */}
      <motion.div variants={staggerItem} style={{ marginTop: '16px' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textMuted, margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          {t('recentHistory')}
        </h3>
        <FramerCard padding="0">
          {history.map(([date, type, district], i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 16px',
              borderBottom: i < history.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
              fontSize: typography.sm, fontFamily: typography.fontFamily,
            }}>
              <span style={{ color: colors.textMuted, width: 60 }}>{date}</span>
              <span style={{ color: colors.textPrimary, flex: 1 }}>{t(type)}</span>
              <span style={{ color: colors.textMuted }}>{district}</span>
            </div>
          ))}
        </FramerCard>
      </motion.div>
    </motion.div>
  );
}

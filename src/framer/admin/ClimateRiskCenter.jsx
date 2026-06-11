import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useClimateAlerts } from '@/hooks/useClimateAlerts';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';
import ChartCard from '../shared/ChartCard';
import { CloudLightning, AlertTriangle, Thermometer, CloudRain, Bug } from '../shared/icons';
import ClimateRiskMap from './ClimateRiskMap';

/**
 * Climate Risk Center — vulnerability matrix, alert timeline, risk map.
 */
export default function ClimateRiskCenter() {
  const { alerts, vulnerabilities, history } = useClimateAlerts();

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Active Alerts */}
      <div className="grid-auto" style={{ marginBottom: '1.5rem' }}>
        {alerts.map((alert, i) => {
          const icons = { Heatwave: Thermometer, 'Heavy Rain': CloudRain, 'Pest Outbreak': Bug };
          const Icon = icons[alert.type] || AlertTriangle;
          return (
            <FramerCard
              key={i}
              glowing={alert.sev === 'critical'}
              style={{ borderTop: `3px solid ${alert.sev === 'critical' ? colors.danger : colors.warning}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Icon size={20} color={alert.sev === 'critical' ? colors.danger : colors.warning} />
                <span style={{
                  fontSize: typography.base, fontWeight: typography.semibold,
                  color: colors.textPrimary, fontFamily: typography.fontFamily,
                }}>
                  {alert.type}
                </span>
                <StatusBadge status={alert.sev} size="sm" pulsing={alert.sev === 'critical'} />
              </div>
              <p style={{
                fontSize: typography.sm, color: colors.textSecondary, margin: '0 0 10px',
                fontFamily: typography.fontFamily, lineHeight: typography.relaxed,
              }}>
                {alert.msg}
              </p>
              <div style={{
                display: 'flex', gap: '16px', fontSize: typography.xs,
                color: colors.textMuted, fontFamily: typography.fontFamily,
              }}>
                <span>📍 {alert.district}</span>
                <span>🌾 {alert.farms} farms</span>
              </div>
            </FramerCard>
          );
        })}
      </div>

      {/* Map and Vulnerability Index Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Climate Hazard Heatmap */}
        <ChartCard title="Climate Hazard Map" subtitle="Active district warning indicators (Satellite)" height={380}>
          <ClimateRiskMap />
        </ChartCard>

        {/* Vulnerability Chart */}
        <ChartCard
          title="Crop Vulnerability Index"
          subtitle="Risk level by crop and growth stage"
          height={380}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vulnerabilities} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="crop" tick={{ fontSize: 11, fill: colors.textMuted }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{
                  background: colors.bgCard, border: `1px solid ${colors.border}`,
                  borderRadius: '10px', fontFamily: typography.fontFamily,
                }}
              />
              <Bar dataKey="risk" radius={[0, 6, 6, 0]}>
                {vulnerabilities.map((v, i) => (
                  <motion.rect key={i} fill={v.risk > 70 ? colors.danger : v.risk > 50 ? colors.warning : colors.success} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Alert History Timeline */}
      <FramerCard>
        <h3 style={{
          fontSize: typography.base, fontWeight: typography.semibold,
          color: colors.textPrimary, margin: '0 0 16px', fontFamily: typography.fontFamily,
        }}>
          Alert Timeline
        </h3>
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 6, top: 0, bottom: 0, width: 2,
            background: colors.border,
          }} />

          {history.map(([date, type, district], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                marginBottom: i < history.length - 1 ? '20px' : 0,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', left: -17, width: 12, height: 12,
                borderRadius: '50%', background: colors.bgCard,
                border: `2px solid ${colors.primary}`,
              }} />
              <div>
                <span style={{
                  fontSize: typography.sm, fontWeight: typography.medium,
                  color: colors.textPrimary, fontFamily: typography.fontFamily,
                }}>
                  {type}
                </span>
                <span style={{
                  fontSize: typography.xs, color: colors.textMuted, marginLeft: '8px',
                  fontFamily: typography.fontFamily,
                }}>
                  {district} · {date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </FramerCard>
    </motion.div>
  );
}

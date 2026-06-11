import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useClimateAlerts } from '@/hooks/useClimateAlerts';
import { useGovernmentData } from '@/hooks/useGovernmentData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import MetricCard from '../shared/MetricCard';
import ChartCard from '../shared/ChartCard';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';
import { CloudLightning, Thermometer, CloudRain, Wind, Droplets, Sun } from '../shared/icons';

/**
 * Climate Monitoring — state weather overview, vulnerability index, historical comparison.
 */
export default function ClimateMonitoring() {
  const { alerts, vulnerabilities } = useClimateAlerts();
  const { monthlyTrends } = useGovernmentData();

  const weatherCards = [
    { label: 'Temperature', value: '34°C', icon: Thermometer, trend: '+2°C', color: colors.danger },
    { label: 'Rainfall', value: '120mm', icon: CloudRain, trend: '+45%', color: colors.info },
    { label: 'Wind Speed', value: '12 km/h', icon: Wind, trend: 'Normal', color: colors.textMuted },
    { label: 'Humidity', value: '68%', icon: Droplets, trend: '-5%', color: colors.success },
  ];

  const rainfallData = monthlyTrends.map(m => ({
    month: m.month,
    rainfall: m.rainfall,
  }));

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Weather Overview */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {weatherCards.map((w, i) => (
          <motion.div key={i} variants={staggerItem}>
            <FramerCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '12px',
                  background: `${w.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <w.icon size={20} color={w.color} />
                </div>
                <div>
                  <p style={{
                    fontSize: typography['2xl'], fontWeight: typography.bold,
                    color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
                  }}>
                    {w.value}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: typography.xs, color: colors.textMuted,
                      fontFamily: typography.fontFamily,
                    }}>
                      {w.label}
                    </span>
                    <span style={{ fontSize: typography.xs, color: w.color, fontFamily: typography.fontFamily }}>
                      {w.trend}
                    </span>
                  </div>
                </div>
              </div>
            </FramerCard>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Rainfall Trend */}
        <ChartCard title="Monthly Rainfall" subtitle="Precipitation in mm" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallData}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: colors.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
              <Bar dataKey="rainfall" fill={colors.info} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Vulnerability Index */}
        <ChartCard title="Crop Vulnerability Index" subtitle="Risk assessment by crop" height={250}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', justifyContent: 'center' }}>
            {vulnerabilities.map((v, i) => (
              <motion.div
                key={v.crop}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <span style={{
                  width: 80, fontSize: typography.sm, color: colors.textPrimary,
                  fontWeight: typography.medium, fontFamily: typography.fontFamily,
                }}>
                  {v.crop}
                </span>
                <div style={{ flex: 1, height: 8, background: colors.bgLighter, borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v.risk}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    style={{
                      height: '100%', borderRadius: 4,
                      background: v.risk > 70 ? colors.danger : v.risk > 50 ? colors.warning : colors.success,
                    }}
                  />
                </div>
                <span style={{
                  width: 40, fontSize: typography.sm, fontWeight: typography.semibold,
                  color: v.risk > 70 ? colors.danger : v.risk > 50 ? colors.warning : colors.success,
                  textAlign: 'right', fontFamily: typography.fontFamily,
                }}>
                  {v.risk}%
                </span>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Active Climate Alerts */}
      <FramerCard>
        <h3 style={{
          fontSize: typography.base, fontWeight: typography.semibold,
          color: colors.textPrimary, margin: '0 0 16px', fontFamily: typography.fontFamily,
        }}>
          Active Climate Alerts
        </h3>
        {alerts.map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '12px 0',
              borderBottom: i < alerts.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
            }}
          >
            <CloudLightning size={18} color={alert.sev === 'critical' ? colors.danger : colors.warning} />
            <div style={{ flex: 1 }}>
              <span style={{
                fontSize: typography.sm, fontWeight: typography.medium,
                color: colors.textPrimary, fontFamily: typography.fontFamily,
              }}>
                {alert.type} — {alert.district}
              </span>
            </div>
            <StatusBadge status={alert.sev} size="sm" pulsing={alert.sev === 'critical'} />
            <span style={{
              fontSize: typography.xs, color: colors.textMuted, fontFamily: typography.fontFamily,
            }}>
              {alert.farms} farms
            </span>
          </motion.div>
        ))}
      </FramerCard>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { PEST_OUTBREAKS } from '@/data/governmentData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';
import MetricCard from '../shared/MetricCard';
import { Bug, AlertTriangle, Target, MapPin } from '../shared/icons';

/**
 * Pest Outbreak Monitoring — outbreak timeline, affected area tracking.
 * Map removed per design update — satellite monitoring is centralised on Maharashtra Overview.
 */
export default function PestOutbreak() {
  const activeCount = PEST_OUTBREAKS.filter(p => p.status === 'active').length;
  const totalAffected = PEST_OUTBREAKS.reduce((s, p) => s + p.farmersAffected, 0);
  const totalArea = PEST_OUTBREAKS.reduce((s, p) => s + p.affectedArea, 0);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Summary */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon={Bug} label="Active Outbreaks" value={activeCount} color={colors.danger} />
        <MetricCard icon={AlertTriangle} label="Total Incidents" value={PEST_OUTBREAKS.length} color={colors.warning} />
        <MetricCard icon={Target} label="Farmers Affected" value={totalAffected} color={colors.danger} />
        <MetricCard icon={MapPin} label="Affected Area (ha)" value={totalArea} color={colors.warning} />
      </div>

      {/* Outbreak Cards — full width */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {PEST_OUTBREAKS.map((outbreak, i) => (
          <motion.div
            key={outbreak.id}
            variants={staggerItem}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <FramerCard
              glowing={outbreak.severity === 'critical'}
              style={{
                borderLeft: `4px solid ${
                  outbreak.severity === 'critical' ? colors.danger :
                  outbreak.severity === 'warning' ? colors.warning :
                  outbreak.severity === 'moderate' ? colors.info : colors.success
                }`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: `${colors.danger}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Bug size={22} color={outbreak.severity === 'critical' ? colors.danger : colors.warning} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: typography.base, fontWeight: typography.semibold,
                      color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
                    }}>
                      {outbreak.pest}
                    </h3>
                    <span style={{ fontSize: typography.xs, color: colors.textMuted, fontFamily: typography.fontFamily }}>
                      Detected: {outbreak.detectedDate}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusBadge status={outbreak.status} size="sm" pulsing={outbreak.status === 'active'} />
                  <StatusBadge status={outbreak.severity} size="sm" />
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
                marginBottom: '14px',
              }}>
                {[
                  { label: 'District', value: outbreak.district },
                  { label: 'Affected Area', value: `${outbreak.affectedArea} ha` },
                  { label: 'Farmers', value: outbreak.farmersAffected },
                ].map((item, j) => (
                  <div key={j} style={{
                    background: colors.bgLighter, borderRadius: '10px', padding: '10px',
                    textAlign: 'center', border: `1px solid ${colors.borderLight}`,
                  }}>
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

              <div style={{
                background: colors.bgLighter, borderRadius: '10px', padding: '10px 14px',
                fontSize: typography.sm, color: colors.textSecondary,
                fontFamily: typography.fontFamily, lineHeight: typography.relaxed,
              }}>
                <strong style={{ color: colors.textPrimary }}>Response:</strong> {outbreak.response}
              </div>
            </FramerCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

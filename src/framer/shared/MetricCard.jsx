import { motion } from 'framer-motion';
import { colors } from './colors';
import { typography } from './typography';
import { staggerItem } from './animations';
import AnimatedCounter from './AnimatedCounter';

/**
 * Reusable metric display with icon, animated value, label, and trend indicator.
 */
export default function MetricCard({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendLabel,
  decimals = 0,
  color = colors.primary,
  onClick,
  compact = false,
}) {
  const isPositive = trend > 0;
  const trendColor = isPositive ? colors.success : colors.danger;

  return (
    <motion.div
      variants={staggerItem}
      initial="initial"
      animate="animate"
      whileHover={onClick ? { scale: 1.03, y: -2 } : undefined}
      onClick={onClick}
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: compact ? '1rem' : '1.25rem',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? '0.5rem' : '0.75rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: compact ? 32 : 40, height: compact ? 32 : 40,
          borderRadius: '12px',
          background: `${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {Icon && <Icon size={compact ? 16 : 20} color={color} />}
        </div>

        {trend !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: typography.xs, color: trendColor, fontWeight: typography.medium,
          }}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div>
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          fontSize={compact ? typography.xl : typography['2xl']}
        />
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: compact ? typography.xs : typography.sm,
          color: colors.textMuted,
          fontFamily: typography.fontFamily,
        }}>
          {label}
        </span>
        {trendLabel && (
          <span style={{
            fontSize: typography.xs, color: trendColor,
            fontFamily: typography.fontFamily,
          }}>
            {trendLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}

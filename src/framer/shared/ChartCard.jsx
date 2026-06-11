import { motion } from 'framer-motion';
import { colors } from './colors';
import { typography } from './typography';
import { staggerItem } from './animations';

/**
 * Chart wrapper with loading animation skeleton and title.
 */
export default function ChartCard({ title, subtitle, children, loading = false, height = 250, actions, style = {} }) {
  return (
    <motion.div
      variants={staggerItem}
      initial="initial"
      animate="animate"
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <div>
          <h3 style={{
            fontSize: typography.base, fontWeight: typography.semibold,
            color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{
              fontSize: typography.xs, color: colors.textMuted, margin: '4px 0 0',
              fontFamily: typography.fontFamily,
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
      </div>

      {loading ? (
        <motion.div
          animate={{
            background: [
              `linear-gradient(90deg, ${colors.bgLight} 25%, ${colors.bgLighter} 50%, ${colors.bgLight} 75%)`,
              `linear-gradient(90deg, ${colors.bgLighter} 25%, ${colors.bgLight} 50%, ${colors.bgLighter} 75%)`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            height, borderRadius: '12px', width: '100%',
          }}
        />
      ) : (
        <div style={{ height, width: '100%' }}>
          {children}
        </div>
      )}
    </motion.div>
  );
}

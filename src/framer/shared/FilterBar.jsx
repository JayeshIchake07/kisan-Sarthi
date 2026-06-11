import { motion } from 'framer-motion';
import { colors } from './colors';
import { typography } from './typography';

/**
 * Animated filter chips for district/crop/status filtering.
 */
export default function FilterBar({ filters, activeFilter, onFilterChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {label && (
        <span style={{
          fontSize: typography.xs, color: colors.textMuted,
          fontWeight: typography.medium, marginRight: '4px',
          fontFamily: typography.fontFamily,
        }}>
          {label}:
        </span>
      )}
      {filters.map((f) => {
        const isActive = activeFilter === (f.value ?? f);
        const value = f.value ?? f;
        const displayLabel = f.label ?? f;

        return (
          <motion.button
            key={value}
            onClick={() => onFilterChange(value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              background: isActive ? colors.primary : 'transparent',
              borderColor: isActive ? colors.primary : colors.border,
              color: isActive ? '#fff' : colors.textSecondary,
            }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: `1px solid ${colors.border}`,
              fontSize: typography.xs,
              fontWeight: typography.medium,
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
              outline: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {displayLabel}
            {f.count !== undefined && (
              <span style={{
                marginLeft: '6px', fontSize: typography.xs,
                opacity: 0.7,
              }}>
                ({f.count})
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

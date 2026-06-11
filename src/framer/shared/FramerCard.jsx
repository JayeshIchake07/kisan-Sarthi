import { motion } from 'framer-motion';
import { colors } from './colors';
import { cardHover, cardTap, staggerItem } from './animations';

/**
 * Animated card with glassmorphism, hover lift, and glow effects.
 */
export default function FramerCard({
  children,
  onClick,
  hoverable = true,
  glowing = false,
  padding = '1.25rem',
  style = {},
  className = '',
  delay = 0,
}) {
  return (
    <motion.div
      variants={staggerItem}
      initial="initial"
      animate="animate"
      whileHover={hoverable ? cardHover.hover : undefined}
      whileTap={onClick ? cardTap : undefined}
      onClick={onClick}
      transition={{ delay }}
      className={`framer-card ${className}`}
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding,
        cursor: onClick ? 'pointer' : 'default',
        backdropFilter: 'blur(20px)',
        boxShadow: glowing
          ? `0 4px 20px rgba(0,0,0,0.4), 0 0 30px ${colors.primaryGlow}`
          : '0 4px 20px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {glowing && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

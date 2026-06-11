import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { colors } from './colors';
import { typography } from './typography';

/**
 * Number counter that animates from 0 to target using Framer Motion spring.
 */
export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1.5,
  decimals = 0,
  fontSize = typography['2xl'],
  color = colors.textPrimary,
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-IN')
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  return (
    <span ref={ref} style={{ display: 'inline-flex', alignItems: 'baseline', ...style }}>
      {prefix && (
        <span style={{ fontSize: `calc(${fontSize} * 0.65)`, color: colors.textSecondary, marginRight: '2px' }}>
          {prefix}
        </span>
      )}
      <motion.span
        style={{
          fontSize,
          fontWeight: typography.bold,
          color,
          fontFamily: typography.fontFamily,
          letterSpacing: typography.trackingTight,
        }}
      >
        {displayValue}
      </motion.span>
      {suffix && (
        <span style={{ fontSize: `calc(${fontSize} * 0.5)`, color: colors.textSecondary, marginLeft: '4px' }}>
          {suffix}
        </span>
      )}
    </span>
  );
}

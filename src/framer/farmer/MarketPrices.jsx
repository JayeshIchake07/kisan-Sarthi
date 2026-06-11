import { motion } from 'framer-motion';
import { useMarketPrices } from '@/hooks/useMarketPrices';
import { CROPS } from '@/data/crops';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import AnimatedCounter from '../shared/AnimatedCounter';
import { IndianRupee, TrendingUp, ArrowUpRight, ArrowDownRight } from '../shared/icons';

/**
 * Market Prices screen — uses useMarketPrices hook.
 */
export default function MarketPrices({ t }) {
  const { crop, setCrop, prices, best, worst } = useMarketPrices('Onion');

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: typography.lg, fontWeight: typography.bold,
          color: colors.textPrimary, margin: '0 0 4px', fontFamily: typography.fontFamily,
        }}>
          {t('marketPrices')}
        </h2>
        <p style={{ fontSize: typography.sm, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
          {t('liveMandiPrices')}
        </p>
      </motion.div>

      {/* Crop Filter */}
      <motion.div variants={staggerItem} style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {CROPS.map(c => (
          <motion.button
            key={c}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCrop(c)}
            style={{
              padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
              background: crop === c ? colors.primary : 'transparent',
              border: `1px solid ${crop === c ? colors.primary : colors.border}`,
              color: crop === c ? '#fff' : colors.textSecondary,
              fontSize: typography.sm, fontWeight: typography.medium,
              fontFamily: typography.fontFamily,
            }}
          >
            {c}
          </motion.button>
        ))}
      </motion.div>

      {/* Best / Worst summary */}
      <div className="grid-2" style={{ marginBottom: '16px' }}>
        <FramerCard glowing>
          <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: '0 0 4px', fontFamily: typography.fontFamily }}>
            {t('bestPrice')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpRight size={16} color={colors.success} />
            <AnimatedCounter value={best} prefix="₹" suffix={t('perQuintal')} fontSize={typography.xl} color={colors.success} />
          </div>
        </FramerCard>
        <FramerCard>
          <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: '0 0 4px', fontFamily: typography.fontFamily }}>
            {t('lowestPrice')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowDownRight size={16} color={colors.danger} />
            <AnimatedCounter value={worst} prefix="₹" suffix={t('perQuintal')} fontSize={typography.xl} color={colors.danger} />
          </div>
        </FramerCard>
      </div>

      {/* Price list */}
      <motion.div variants={staggerItem}>
        <FramerCard padding="0">
          {prices.map((p, i) => {
            const pctOfBest = best > 0 ? (p.price / best) * 100 : 0;
            return (
              <motion.div
                key={`${p.mandi}-${p.commodity}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px',
                  borderBottom: i < prices.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: i === 0 ? `${colors.success}15` : `${colors.primary}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IndianRupee size={16} color={i === 0 ? colors.success : colors.textMuted} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: typography.sm, fontWeight: typography.medium,
                    color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
                  }}>
                    {p.mandi}
                  </p>
                  <p style={{
                    fontSize: typography.xs, color: colors.textMuted, margin: '2px 0 0',
                    fontFamily: typography.fontFamily,
                  }}>
                    {p.district}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: typography.base, fontWeight: typography.bold,
                    color: i === 0 ? colors.success : colors.textPrimary,
                    margin: 0, fontFamily: typography.fontFamily,
                  }}>
                    ₹{p.price.toLocaleString('en-IN')}
                  </p>
                  <div style={{
                    marginTop: '4px', height: 3, width: 60, background: colors.bgLighter,
                    borderRadius: 2, overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pctOfBest}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                      style={{
                        height: '100%', borderRadius: 2,
                        background: i === 0 ? colors.success : colors.primary,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </FramerCard>
      </motion.div>
    </motion.div>
  );
}

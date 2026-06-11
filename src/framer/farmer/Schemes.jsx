import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchemes } from '@/hooks/useSchemes';
import { D } from '@/data/seedData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';
import {
  Landmark, Shield, CreditCard, Sprout, Award, HelpCircle,
  ChevronDown, ChevronUp, RefreshCw, Zap
} from '../shared/icons';

/**
 * Schemes Screen Component — programmatically evaluates farmer eligibility
 * and calls Gemini AI to explain specific scheme benefits and documentation.
 */
export default function Schemes({ t }) {
  const currentFarmer = D.plots[0]; // রমেশ পাটিল, Nashik
  const { schemes, loading, explainingId, explanations, explainBenefits } = useSchemes(currentFarmer);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSchemeIcon = (id) => {
    switch (id) {
      case 'pm-kisan': return Landmark;
      case 'pmfby': return Shield;
      case 'kcc': return CreditCard;
      case 'soil-health': return Sprout;
      case 'state-scheme': return Award;
      default: return Landmark;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Eligible': return colors.success;
      case 'Potentially Eligible': return colors.warning;
      case 'Not Eligible': return colors.danger;
      default: return colors.textMuted;
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ paddingBottom: '20px' }}>
      
      {/* Header */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: typography.lg, fontWeight: typography.bold,
          color: colors.textPrimary, margin: '0 0 4px', fontFamily: typography.fontFamily,
        }}>
          {t('governmentSchemes')}
        </h2>
        <p style={{
          fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily,
        }}>
          {t('schemeStatus')}
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <FramerCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: '0 0 2px', fontFamily: typography.fontFamily }}>
                {t('verifiedId')}
              </p>
              <h3 style={{ fontSize: typography.base, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0 }}>
                {currentFarmer.farmer}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: colors.textMuted, display: 'block', fontFamily: typography.fontFamily }}>
                {t('landHolding')}
              </span>
              <span style={{ fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary }}>
                {currentFarmer.acres} Acres ({currentFarmer.district})
              </span>
            </div>
          </div>
        </FramerCard>
      </motion.div>

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="shimmer" style={{ height: '90px', borderRadius: '12px' }} />
          ))}
        </div>
      )}

      {/* Schemes List */}
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {schemes.map((scheme, i) => {
            const Icon = getSchemeIcon(scheme.id);
            const isExpanded = expandedId === scheme.id;
            const status = scheme.eligibility.status;
            const statusColor = getStatusColor(status);
            const explanation = explanations[scheme.id];

            return (
              <motion.div
                key={scheme.id}
                variants={staggerItem}
                layout
                style={{ borderRadius: '14px', overflow: 'hidden' }}
              >
                <div
                  onClick={() => toggleExpand(scheme.id)}
                  style={{
                    background: colors.bgCard,
                    border: `1px solid ${isExpanded ? colors.primary : colors.border}`,
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '10px',
                        background: `${statusColor}10`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={18} color={statusColor} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0 }}>
                          {scheme.name}
                        </h4>
                        <span style={{ fontSize: '10px', color: colors.textMuted, fontFamily: typography.fontFamily }}>
                          {scheme.fullName}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: statusColor,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: `${statusColor}12`,
                        fontFamily: typography.fontFamily,
                      }}>
                        {status}
                      </span>
                      {isExpanded ? <ChevronUp size={14} color={colors.textMuted} /> : <ChevronDown size={14} color={colors.textMuted} />}
                    </div>
                  </div>

                  {/* Programmatic status description */}
                  <div style={{
                    fontSize: '11px',
                    color: colors.textSecondary,
                    background: colors.bgLight,
                    borderLeft: `3px solid ${statusColor}`,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontFamily: typography.fontFamily,
                  }}>
                    {scheme.eligibility.reason}
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: `1px solid ${colors.borderLight}`, paddingTop: '12px' }}
                        onClick={(e) => e.stopPropagation()} // stop parent expand toggle
                      >
                        <div>
                          <span style={{ fontSize: '9px', color: colors.textMuted, fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t('schemeDescription')}
                          </span>
                          <p style={{ fontSize: typography.xs, color: colors.textPrimary, margin: 0, lineHeight: 1.5 }}>
                            {scheme.description}
                          </p>
                        </div>

                        <div>
                          <span style={{ fontSize: '9px', color: colors.textMuted, fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t('standardBenefits')}
                          </span>
                          <p style={{ fontSize: typography.xs, color: colors.textPrimary, margin: 0, lineHeight: 1.5 }}>
                            {scheme.benefits}
                          </p>
                        </div>

                        {/* AI Benefits Assistant Button */}
                        <button
                          onClick={() => explainBenefits(scheme)}
                          disabled={explainingId === scheme.id}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            background: explainingId === scheme.id ? colors.bgLight : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                            border: 'none',
                            cursor: explainingId === scheme.id ? 'not-allowed' : 'pointer',
                            color: '#ffffff',
                            fontSize: typography.xs,
                            fontWeight: typography.bold,
                            fontFamily: typography.fontFamily,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            marginTop: '4px',
                          }}
                        >
                          {explainingId === scheme.id ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <RefreshCw size={12} />
                              </motion.div>
                              {t('consultingBenefits')}
                            </>
                          ) : (
                            <>
                              <Zap size={12} />
                              {t('explainBenefits')}
                            </>
                          )}
                        </button>

                        {/* AI Response Card */}
                        {explanation && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                              background: `${colors.primary}08`,
                              border: `1px solid ${colors.primary}20`,
                              borderRadius: '8px',
                              padding: '10px 12px',
                              fontSize: '11px',
                              color: colors.textSecondary,
                              lineHeight: 1.6,
                              fontFamily: typography.fontFamily,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                              <Zap size={12} color={colors.primaryLight} />
                              <strong style={{ color: colors.primaryLight }}>{t('aiGuideRecommendation')}</strong>
                            </div>
                            {explanation}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

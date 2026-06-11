import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvisory } from '@/hooks/useAdvisory';
import { useLanguage } from '@/hooks/useLanguage';
import { D } from '@/data/seedData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';
import {
  Sprout, RefreshCw, Zap, Activity, AlertTriangle, CloudSun,
  ShieldCheck, HelpCircle, TrendingUp, Calendar, CheckSquare, Square
} from '../shared/icons';

/**
 * Upgraded AI Advisory Screen — Agricultural Intelligence Advisor dashboard.
 * Takes multi-spectral satellite telemetry and yields a structured advice block.
 */
export default function AIAdvisory({ t }) {
  const { lang } = useLanguage();
  const [selectedPlot, setSelectedPlot] = useState(D.plots[0]);
  const { advisory, loading, generate, reset } = useAdvisory();
  const [checkedActions, setCheckedActions] = useState({});

  const handleToggleAction = (index) => {
    setCheckedActions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getConfidenceColor = (score) => {
    if (score >= 90) return colors.success;
    if (score >= 80) return colors.warning;
    return colors.danger;
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ paddingBottom: '30px' }}>
      
      {/* Title */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: typography.lg, fontWeight: typography.bold,
          color: colors.textPrimary, margin: '0 0 4px', fontFamily: typography.fontFamily,
        }}>
          {t('agriIntelligenceAdvisor')}
        </h2>
        <p style={{
          fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily,
        }}>
          {t('satelliteTelemetry')}
        </p>
      </motion.div>

      {/* Selector */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <FramerCard>
          <p style={{
            fontSize: '10px', color: colors.textMuted, margin: '0 0 10px',
            fontFamily: typography.fontFamily, textTransform: 'uppercase',
            fontWeight: 700, letterSpacing: '0.5px'
          }}>
            {t('selectCropField')}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {D.plots.slice(0, 4).map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setSelectedPlot(p); reset(); setCheckedActions({}); }}
                style={{
                  padding: '8px 12px', borderRadius: '10px', cursor: 'pointer',
                  background: selectedPlot.id === p.id ? colors.primary : 'transparent',
                  border: `1px solid ${selectedPlot.id === p.id ? colors.primary : colors.border}`,
                  color: selectedPlot.id === p.id ? '#fff' : colors.textSecondary,
                  fontSize: typography.xs, fontWeight: typography.semibold,
                  fontFamily: typography.fontFamily,
                }}
              >
                {p.crop} · {p.farmer.split(' ')[0]}
              </motion.button>
            ))}
          </div>
        </FramerCard>
      </motion.div>

      {/* Selected Field Metadata */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <FramerCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '12px',
              background: `${colors.primary}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sprout size={22} color={colors.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: typography.base, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0 }}>
                {selectedPlot.farmer}'s Field
              </h3>
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: '3px 0 0', fontFamily: typography.fontFamily }}>
                Area: {selectedPlot.acres} ac · NDVI: {selectedPlot.ndvi} · NDWI: {selectedPlot.ndwi} · {selectedPlot.district}
              </p>
            </div>
            <StatusBadge status={selectedPlot.stress} size="sm" pulsing={selectedPlot.stress === 'severe'} />
          </div>
        </FramerCard>
      </motion.div>

      {/* Assessment Button */}
      <motion.button
        variants={staggerItem}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => generate(selectedPlot, lang)}
        disabled={loading}
        style={{
          width: '100%', padding: '14px', borderRadius: '12px',
          background: loading ? colors.bgLighter : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          color: '#fff', fontSize: typography.sm, fontWeight: typography.bold,
          fontFamily: typography.fontFamily, marginBottom: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
        }}
      >
        {loading ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw size={16} />
            </motion.div>
            {t('queryingSatellite')}
          </>
        ) : (
          <>
            <Zap size={16} />
            {t('runDiagnostics')}
          </>
        )}
      </motion.button>

      {/* Advisory Result Panel */}
      <AnimatePresence mode="wait">
        {advisory && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            {/* Status & Confidence Card */}
            <FramerCard glowing>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color={colors.primaryLight} />
                  <span style={{ fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary }}>
                    {t('cropHealthStatus')}
                  </span>
                </div>
                <span style={{
                  fontSize: typography.xs, fontWeight: 700, color: colors.primaryLight,
                  background: `${colors.primary}15`, padding: '4px 10px', borderRadius: '8px'
                }}>
                  {advisory.cropHealthStatus}
                </span>
              </div>

              {/* Confidence Meter */}
              <div style={{ background: colors.bgLight, padding: '12px', borderRadius: '10px', border: `1px solid ${colors.borderLight}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px', fontFamily: typography.fontFamily }}>
                  <span style={{ color: colors.textMuted }}>{t('satelliteConfidenceIndex')}</span>
                  <span style={{ color: getConfidenceColor(advisory.confidenceScore), fontWeight: 700 }}>{advisory.confidenceScore}%</span>
                </div>
                <div style={{ height: 6, background: colors.bgLighter, borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${advisory.confidenceScore}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      height: '100%', borderRadius: 3,
                      background: getConfidenceColor(advisory.confidenceScore)
                    }}
                  />
                </div>
              </div>
            </FramerCard>

            {/* Diagnostics Card */}
            <FramerCard>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <AlertTriangle size={14} color={colors.warning} />
                    <span style={{ fontSize: '10px', color: colors.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                      {t('primaryDiagnosis')}
                    </span>
                  </div>
                  <p style={{ fontSize: typography.sm, color: colors.textPrimary, margin: 0, fontWeight: 600 }}>
                    {advisory.primaryIssue}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <HelpCircle size={14} color={colors.textMuted} />
                    <span style={{ fontSize: '10px', color: colors.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                      {t('possibleCauses')}
                    </span>
                  </div>
                  <p style={{ fontSize: typography.xs, color: colors.textSecondary, margin: 0, lineHeight: 1.5 }}>
                    {advisory.possibleCauses}
                  </p>
                </div>
              </div>
            </FramerCard>

            {/* Immediate Actions Checklist */}
            <FramerCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ShieldCheck size={18} color={colors.success} />
                <span style={{ fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary }}>
                  {t('immediateActions')}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {advisory.immediateActions?.map((action, idx) => {
                  const isChecked = !!checkedActions[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleAction(idx)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '10px 12px', background: isChecked ? `${colors.success}06` : colors.bgLight,
                        border: `1px solid ${isChecked ? colors.success : colors.borderLight}`,
                        borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ marginTop: '2px', display: 'flex', flexShrink: 0 }}>
                        {isChecked ? <CheckSquare size={16} color={colors.success} /> : <Square size={16} color={colors.textMuted} />}
                      </span>
                      <span style={{
                        fontSize: typography.xs, color: isChecked ? colors.textMuted : colors.textPrimary,
                        textDecoration: isChecked ? 'line-through' : 'none',
                        lineHeight: 1.4, fontFamily: typography.fontFamily
                      }}>
                        {action}
                      </span>
                    </div>
                  );
                })}
              </div>
            </FramerCard>

            {/* Secondary Insights (Yield, Weather, Market) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              
              {/* Weather & Yield */}
              <FramerCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <CloudSun size={14} color={colors.info} />
                  <span style={{ fontSize: '10px', color: colors.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                    {t('weatherImpact')}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: colors.textPrimary, margin: '0 0 6px', lineHeight: 1.4, fontFamily: typography.fontFamily }}>
                  {advisory.weatherImpact}
                </p>
                <div style={{ fontSize: '11px', borderTop: `1px solid ${colors.borderLight}`, paddingTop: '6px' }}>
                  <span style={{ color: colors.textMuted }}>{t('expectedYieldLoss')}:</span>{' '}
                  <span style={{ color: colors.danger, fontWeight: 700 }}>{advisory.expectedYieldImpact}</span>
                </div>
              </FramerCard>

              {/* Market Pricing */}
              <FramerCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <TrendingUp size={14} color={colors.warning} />
                  <span style={{ fontSize: '10px', color: colors.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                    {t('marketIntelligence')}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: colors.textPrimary, margin: '0 0 6px', lineHeight: 1.4, fontFamily: typography.fontFamily }}>
                  {advisory.marketRecommendation}
                </p>
                <div style={{ fontSize: '11px', borderTop: `1px solid ${colors.borderLight}`, paddingTop: '6px', color: colors.textSecondary }}>
                  {t('apmcTrend')}
                </div>
              </FramerCard>
            </div>

            {/* Next Follow-up Date */}
            <FramerCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontFamily: typography.fontFamily }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color={colors.textMuted} />
                  <span style={{ color: colors.textMuted }}>{t('nextOverpass')}</span>
                </div>
                <span style={{ color: colors.textPrimary, fontWeight: 700 }}>{advisory.nextFollowUpDate}</span>
              </div>
            </FramerCard>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

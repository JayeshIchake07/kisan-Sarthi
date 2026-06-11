import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { D } from '@/data/seedData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';
import AdvisoryCenterMap from './AdvisoryCenterMap';
import { Sprout, Check, X, Send, Clock, FileCheck, Zap, Search } from '../shared/icons';

/**
 * Advisory Center — interactive satellite action map with AI advisory queue.
 */
export default function AdvisoryCenter() {
  const [activeFilter, setActiveFilter] = useState('critical'); // 'critical' | 'moderate' | 'healthy'
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize queue with 4 default advisories
  const [queue, setQueue] = useState(() =>
    D.plots.slice(0, 4).map((p, i) => ({
      id: i + 1,
      farmer: p.farmer,
      crop: p.crop,
      district: p.district,
      ndvi: p.ndvi,
      stress: p.stress,
      status: i === 0 ? 'pending' : i === 1 ? 'approved' : 'sent',
      advisory: `ADVISORY: ${p.crop} crop needs attention. NDVI at ${p.ndvi} suggests ${p.stress} stress levels. ACTION: Apply recommended treatment within 48 hours. RISK: ${p.stress === 'severe' ? '35%' : '15%'} yield loss if untreated.`,
      generatedAt: `${Math.floor(Math.random() * 8 + 2)}h ago`,
    }))
  );

  // Filter plots shown on the map
  const mapPlots = D.plots.filter(p => {
    if (activeFilter === 'critical') return p.stress === 'severe';
    if (activeFilter === 'moderate') return p.stress === 'mild';
    return p.stress === 'healthy';
  });

  const approve = (id) => setQueue(q => q.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  const reject = (id) => setQueue(q => q.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  const send = (id) => setQueue(q => q.map(a => a.id === id ? { ...a, status: 'sent' } : a));

  const generateAdvisory = () => {
    if (!selectedPlot) return;
    setIsGenerating(true);
    setTimeout(() => {
      const newAdvisory = {
        id: Date.now(),
        farmer: selectedPlot.farmer,
        crop: selectedPlot.crop,
        district: selectedPlot.district,
        ndvi: selectedPlot.ndvi,
        stress: selectedPlot.stress,
        status: 'pending',
        advisory: `AI ADVISORY: Targeted intervention generated for ${selectedPlot.farmer}'s ${selectedPlot.crop} field in ${selectedPlot.district}. NDVI is currently at ${selectedPlot.ndvi.toFixed(3)} representing ${selectedPlot.stress === 'severe' ? 'critical yield risk. ACTION: Apply potassium silicate + irrigation immediately to mitigate stress.' : 'mild moisture stress. ACTION: Spray liquid micronutrients and schedule irrigation.'} Projected yield recovery: +15%.`,
        generatedAt: 'Just now',
      };
      setQueue(prev => [newAdvisory, ...prev]);
      setIsGenerating(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  const counts = {
    pending: queue.filter(a => a.status === 'pending').length,
    approved: queue.filter(a => a.status === 'approved').length,
    sent: queue.filter(a => a.status === 'sent').length,
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      
      {/* Action Center Summary cards */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Pending Review', count: counts.pending, icon: Clock, color: colors.warning },
          { label: 'Approved', count: counts.approved, icon: FileCheck, color: colors.success },
          { label: 'Sent to Farmers', count: counts.sent, icon: Send, color: colors.primary },
        ].map((s) => (
          <FramerCard key={s.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '12px',
                background: `${s.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <p style={{
                  fontSize: typography['2xl'], fontWeight: typography.bold,
                  color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
                }}>
                  {s.count}
                </p>
                <p style={{
                  fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily,
                }}>
                  {s.label}
                </p>
              </div>
            </div>
          </FramerCard>
        ))}
      </div>

      {/* Main Action Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.5rem' }}>
        
        {/* Left Side: Interactive Map & Generator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <motion.div variants={staggerItem}>
            <FramerCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily }}>
                    Advisory Map
                  </h3>
                  <p style={{ fontSize: '11px', color: colors.textMuted, margin: '2px 0 0', fontFamily: typography.fontFamily }}>
                    Showing only fields needing target recommendations
                  </p>
                </div>
              </div>

              {/* Map Filter Tabs */}
              <div style={{ display: 'flex', gap: '4px', background: colors.bgLighter, borderRadius: '8px', padding: '3px', marginBottom: '12px' }}>
                {[
                  { id: 'critical', label: 'Critical', color: colors.danger },
                  { id: 'moderate', label: 'Moderate', color: colors.warning },
                  { id: 'healthy', label: 'Healthy', color: colors.success }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveFilter(tab.id);
                      setSelectedPlot(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: activeFilter === tab.id ? `${tab.color}15` : 'transparent',
                      border: `1px solid ${activeFilter === tab.id ? `${tab.color}30` : 'transparent'}`,
                      borderRadius: '6px',
                      color: activeFilter === tab.id ? tab.color : colors.textMuted,
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: activeFilter === tab.id ? '700' : '500',
                      fontFamily: typography.fontFamily,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: tab.color }} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <AdvisoryCenterMap
                plots={mapPlots}
                selectedPlot={selectedPlot}
                onSelectPlot={setSelectedPlot}
              />
            </FramerCard>
          </motion.div>

          {/* Generator detail panel */}
          <motion.div variants={staggerItem}>
            <AnimatePresence mode="wait">
              {showSuccess && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{
                  background: colors.successBg, border: `1px solid ${colors.success}`, borderRadius: '12px',
                  padding: '10px 14px', fontSize: typography.xs, color: colors.success, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <Check size={14} />
                  <span>AI Advisory successfully added to queue! Review on the right.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {selectedPlot ? (
                <motion.div
                  key={selectedPlot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <FramerCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0 }}>
                        {selectedPlot.farmer}
                      </h4>
                      <StatusBadge status={selectedPlot.stress} size="sm" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '11px', color: colors.textSecondary }}>
                      <div>🌾 Crop: <strong style={{ color: colors.textPrimary }}>{selectedPlot.crop}</strong></div>
                      <div>📍 District: <strong style={{ color: colors.textPrimary }}>{selectedPlot.district}</strong></div>
                      <div>📉 NDVI: <strong style={{ color: colors.textPrimary }}>{selectedPlot.ndvi.toFixed(3)}</strong></div>
                      <div>⚠ Risk Score: <strong style={{ color: colors.textPrimary }}>{selectedPlot.riskScore}/100</strong></div>
                    </div>

                    <button
                      onClick={generateAdvisory}
                      disabled={isGenerating}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        background: isGenerating ? colors.bgLighter : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                        border: 'none',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        color: '#ffffff',
                        fontSize: typography.xs,
                        fontWeight: typography.bold,
                        fontFamily: typography.fontFamily,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'background 0.2s'
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <Zap size={12} />
                          </motion.div>
                          Analyzing crop pixels...
                        </>
                      ) : (
                        <>
                          <Zap size={12} />
                          Generate AI Advisory
                        </>
                      )}
                    </button>
                  </FramerCard>
                </motion.div>
              ) : (
                <FramerCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', borderStyle: 'dashed', borderWidth: '1px', borderColor: colors.border }}>
                  <div style={{ textAlign: 'center', color: colors.textMuted, fontFamily: typography.fontFamily, fontSize: typography.xs }}>
                    <Search size={16} style={{ marginBottom: '6px', color: colors.textDim }} />
                    <p style={{ margin: 0 }}>Select an active farm on the map to draft an AI Advisory</p>
                  </div>
                </FramerCard>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Side: Advisory Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence>
            {queue.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'relative' }}
              >
                <FramerCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '10px',
                        background: `${colors.primary}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Sprout size={18} color={colors.primary} />
                      </div>
                      <div>
                        <span style={{
                          fontSize: typography.sm, fontWeight: typography.semibold,
                          color: colors.textPrimary, fontFamily: typography.fontFamily,
                        }}>
                          {a.farmer}
                        </span>
                        <span style={{
                          fontSize: typography.xs, color: colors.textMuted, marginLeft: '8px',
                          fontFamily: typography.fontFamily,
                        }}>
                          {a.crop} · {a.district} · NDVI {a.ndvi.toFixed(3)}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge status={a.status === 'sent' ? 'approved' : a.status} label={a.status} size="sm" />
                      <span style={{ fontSize: typography.xs, color: colors.textDim, fontFamily: typography.fontFamily }}>
                        {a.generatedAt}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: colors.bgLighter, borderRadius: '10px', padding: '12px',
                    fontSize: typography.sm, color: colors.textSecondary,
                    fontFamily: typography.fontFamily, lineHeight: typography.relaxed,
                    marginBottom: '10px',
                  }}>
                    {a.advisory}
                  </div>

                  {a.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => reject(a.id)}
                        style={{
                          padding: '6px 16px', borderRadius: '8px', cursor: 'pointer',
                          background: `${colors.danger}15`, border: `1px solid ${colors.danger}30`,
                          color: colors.danger, fontSize: typography.xs, fontWeight: typography.medium,
                          fontFamily: typography.fontFamily, display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <X size={14} /> Reject
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => approve(a.id)}
                        style={{
                          padding: '6px 16px', borderRadius: '8px', cursor: 'pointer',
                          background: colors.primary, border: 'none',
                          color: '#fff', fontSize: typography.xs, fontWeight: typography.medium,
                          fontFamily: typography.fontFamily, display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <Check size={14} /> Approve
                      </motion.button>
                    </div>
                  )}

                  {a.status === 'approved' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => send(a.id)}
                        style={{
                          padding: '6px 16px', borderRadius: '8px', cursor: 'pointer',
                          background: `${colors.primary}15`, border: `1px solid ${colors.primary}30`,
                          color: colors.primary, fontSize: typography.xs, fontWeight: typography.medium,
                          fontFamily: typography.fontFamily, display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <Send size={14} /> Send to Farmer
                      </motion.button>
                    </div>
                  )}
                </FramerCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}

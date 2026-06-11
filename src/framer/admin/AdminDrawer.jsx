import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdvisory } from '@/hooks/useAdvisory';
import { D } from '@/data/seedData';
import { colors, typography } from '../shared';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';
import {
  X, Phone, MessageSquare, Zap, Clock, ShieldAlert,
  Activity, Droplets, MapPin, Sprout, ShieldCheck, Check
} from '../shared/icons';

export default function AdminDrawer({ farm, onClose }) {
  const [smsSent, setSmsSent] = useState(false);
  const [calling, setCalling] = useState(false);
  
  // AI advisory hook
  const { advisory, loading, generate, reset } = useAdvisory();

  // Deterministic 180-day NDVI History data from plot id
  const trendData = useMemo(() => {
    if (!farm) return [];
    return D.hist[farm.id] || [];
  }, [farm]);

  if (!farm) return null;

  // Actions
  const handleSendSMS = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  const handleCallFarmer = () => {
    setCalling(true);
    setTimeout(() => setCalling(false), 3000);
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        top: 64, // below topbar height
        right: 0,
        width: '380px',
        height: 'calc(100vh - 64px)',
        background: colors.bgLight,
        borderLeft: `1px solid ${colors.border}`,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        zIndex: 999,
        padding: '20px',
        overflowY: 'auto',
        fontFamily: typography.fontFamily,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '12px',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: typography.base, fontWeight: typography.bold
          }}>
            {farm.initials}
          </div>
          <div>
            <h2 style={{ fontSize: typography.base, fontWeight: typography.bold, color: colors.textPrimary, margin: 0 }}>
              {farm.farmer}
            </h2>
            <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: '2px 0 0' }}>
              Nashik Agro Member #{farm.id}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer',
            padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>
      </div>

      <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: 0 }} />

      {/* Grid of Key Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { label: 'Crop Type', value: farm.crop, icon: Sprout, color: colors.primaryLight },
          { label: 'Acreage', value: `${farm.acres} ac`, icon: Activity, color: colors.success },
          { label: 'District', value: farm.district, icon: MapPin, color: colors.warning },
          { label: 'Loan Score', value: `${farm.riskScore}/100`, icon: ShieldCheck, color: colors.info }
        ].map((item, i) => (
          <div key={i} style={{
            background: colors.bgLighter,
            border: `1px solid ${colors.borderLight}`,
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <item.icon size={16} color={item.color} />
            <div>
              <span style={{ fontSize: '9px', color: colors.textMuted, display: 'block' }}>{item.label}</span>
              <span style={{ fontSize: typography.xs, fontWeight: typography.semibold, color: colors.textPrimary }}>{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* NDVI & Soil Water metrics */}
      <FramerCard>
        <h3 style={{ fontSize: typography.xs, fontWeight: typography.semibold, color: colors.textSecondary, textTransform: 'uppercase', margin: '0 0 12px' }}>
          Satellite Indices
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: typography.xs, color: colors.textMuted }}>NDVI Status</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: typography.md, fontWeight: typography.bold, color: farm.ndvi > 0.4 ? colors.success : colors.danger }}>
                {farm.ndvi}
              </span>
              <StatusBadge status={farm.stress} size="sm" />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: typography.xs, color: colors.textMuted }}>Soil Moisture (NDWI)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', justifyContent: 'flex-end' }}>
              <Droplets size={12} color={farm.ndwi > 0.1 ? colors.success : colors.danger} />
              <span style={{ fontSize: typography.md, fontWeight: typography.bold, color: farm.ndwi > 0.1 ? colors.success : colors.danger }}>
                {farm.ndwi}
              </span>
            </div>
          </div>
        </div>

        {/* Recharts history trend */}
        <div style={{ height: '70px', marginTop: '4px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="drawerTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.success} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.success} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="ndvi" stroke={colors.success} strokeWidth={1.5} fill="url(#drawerTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </FramerCard>

      {/* Advisory history logs */}
      <FramerCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Clock size={14} color={colors.textMuted} />
          <h3 style={{ fontSize: typography.xs, fontWeight: typography.semibold, color: colors.textSecondary, textTransform: 'uppercase', margin: 0 }}>
            Communication Logs
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '6px' }}>
            <span style={{ color: colors.textSecondary }}>Voice Alert sent</span>
            <span style={{ color: colors.textMuted }}>2 days ago</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: colors.textSecondary }}>NDVI decline SMS alert</span>
            <span style={{ color: colors.textMuted }}>Last Friday</span>
          </div>
        </div>
      </FramerCard>

      {/* Action panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
        {smsSent && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
            background: colors.successBg, border: `1px solid ${colors.success}`, borderRadius: '8px',
            padding: '8px 12px', fontSize: typography.xs, color: colors.success, display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <Check size={14} />
            <span>SMS successfully queued for dispatch.</span>
          </motion.div>
        )}

        {calling && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
            background: colors.infoBg, border: `1px solid ${colors.info}`, borderRadius: '8px',
            padding: '8px 12px', fontSize: typography.xs, color: colors.info, display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <Phone size={14} />
            <span>Calling {farm.farmer} ({farm.phone})...</span>
          </motion.div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={handleSendSMS}
            style={{
              padding: '10px', borderRadius: '8px', background: colors.bgLighter,
              border: `1px solid ${colors.border}`, color: colors.textPrimary,
              fontSize: typography.xs, fontWeight: typography.semibold, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <MessageSquare size={13} color={colors.primaryLight} />
            Send SMS
          </button>
          
          <button
            onClick={handleCallFarmer}
            style={{
              padding: '10px', borderRadius: '8px', background: colors.bgLighter,
              border: `1px solid ${colors.border}`, color: colors.textPrimary,
              fontSize: typography.xs, fontWeight: typography.semibold, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <Phone size={13} color={colors.info} />
            Call Farmer
          </button>
        </div>

        {/* AI generate button */}
        <button
          onClick={() => generate(farm)}
          disabled={loading}
          style={{
            padding: '12px', borderRadius: '8px',
            background: loading ? colors.bgLighter : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            border: 'none', color: '#ffffff',
            fontSize: typography.xs, fontWeight: typography.bold, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          <Zap size={14} />
          {loading ? 'Generating advisory...' : 'Generate AI Advisory'}
        </button>

        {advisory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              background: colors.bgLighter, border: `1px solid ${colors.border}`,
              borderRadius: '8px', padding: '10px', fontSize: '11px',
              color: colors.textSecondary, lineHeight: 1.5, maxHeight: '120px', overflowY: 'auto'
            }}
          >
            {advisory}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

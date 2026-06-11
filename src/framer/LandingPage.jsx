import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedCounter, cardHover, colors, staggerContainer, staggerItem, typography } from './shared';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  CloudRain,
  CreditCard,
  Globe,
  IndianRupee,
  Landmark,
  Leaf,
  MapPin,
  Satellite,
  Shield,
  Sprout,
  Signal,
  Smartphone,
  Target,
  Thermometer,
  TrendingUp,
  Users,
  Wind,
  Zap,
} from './shared/icons';

// ─── Farmland aerial image path (generated asset) ───────────────────────────
const FARMLAND_IMG = `${import.meta.env.BASE_URL || '/'}farmland_aerial.png`;

// ─── Portal preview sub-components (unchanged) ──────────────────────────────

function PortalPreview({ portal }) {
  const palette = {
    farmer: '#22c55e',
    admin: '#14b8a6',
    government: '#f59e0b',
    bank: '#38bdf8',
  }[portal.id];

  const frameStyles = {
    borderRadius: '22px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'linear-gradient(180deg, rgba(8, 22, 14, 0.96), rgba(6, 14, 10, 0.98))',
  };

  if (portal.id === 'farmer') {
    return (
      <div style={frameStyles}>
        <div
          style={{
            height: 168,
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(14, 40, 24, 0.96), rgba(8, 21, 13, 0.96))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 24px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 18px)',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '46% -6% -10%',
              background:
                'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(21, 128, 61, 0.78) 32%, rgba(22, 101, 52, 0.92) 68%, rgba(9, 32, 18, 1) 100%)',
              clipPath: 'polygon(0 52%, 12% 34%, 24% 58%, 40% 27%, 55% 62%, 71% 31%, 86% 50%, 100% 24%, 100% 100%, 0 100%)',
            }}
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 72,
              height: 72,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 50% 46%, rgba(255,255,255,0.92) 0 15%, rgba(250,204,21,0.88) 16% 22%, rgba(8,21,13,0) 23%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: 14,
              padding: '6px 10px',
              borderRadius: 999,
              background: 'rgba(6,15,9,0.72)',
              border: '1px solid rgba(52,211,153,0.18)',
              color: '#d1fae5',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            NDVI Healthy · 0.72
          </div>
          <div
            style={{
              position: 'absolute',
              right: 14,
              bottom: 14,
              padding: '7px 10px',
              borderRadius: 14,
              background: 'rgba(6,15,9,0.72)',
              border: '1px solid rgba(52,211,153,0.16)',
              color: colors.textSecondary,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Advisory ready
          </div>
        </div>
        <div style={{ padding: 14, display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: colors.textSecondary, fontSize: 12, fontWeight: 800 }}>Crop health score</div>
              <div style={{ color: colors.textMuted, fontSize: 11, marginTop: 3 }}>Low moisture stress, healthy canopy</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, color: palette }}>
              <span style={{ fontSize: 26, fontWeight: 900 }}>92</span>
              <span style={{ fontSize: 12, fontWeight: 800 }}>%</span>
            </div>
          </div>
          <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ width: '92%', height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${palette}, rgba(255,255,255,0.85))` }} />
          </div>
          <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.45 }}>Irrigation suggested within 48 hours based on soil moisture index.</div>
        </div>
      </div>
    );
  }

  if (portal.id === 'admin') {
    return (
      <div style={frameStyles}>
        <div style={{ padding: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: colors.textSecondary, fontSize: 12, fontWeight: 800 }}>Monitoring dashboard</div>
          <div style={{ color: palette, fontSize: 11, fontWeight: 800 }}>Live</div>
        </div>
        <div style={{ padding: 14, display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {['Fields', 'Alerts', 'Coverage'].map((label, index) => (
              <div key={label} style={{ padding: 10, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: colors.textMuted, fontSize: 10 }}>{label}</div>
                <div style={{ marginTop: 8, fontSize: 18, fontWeight: 900, color: index === 1 ? '#fca5a5' : colors.textPrimary }}>{index === 0 ? '30' : index === 1 ? '4' : '98%'}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 10, borderRadius: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#fecaca', fontSize: 11, fontWeight: 700 }}>Farm alert</div>
              <div style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>Pest pressure rising in Wardha block</div>
            </div>
            <AlertTriangle size={16} color="#fca5a5" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 8 }}>
            <div style={{ height: 76, borderRadius: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.16)', padding: 10, display: 'grid', gap: 6 }}>
              <div style={{ color: colors.textMuted, fontSize: 10 }}>Member activity</div>
              <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}><div style={{ width: '82%', height: '100%', borderRadius: 999, background: palette }} /></div>
              <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}><div style={{ width: '61%', height: '100%', borderRadius: 999, background: 'rgba(255,255,255,0.42)' }} /></div>
              <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}><div style={{ width: '73%', height: '100%', borderRadius: 999, background: 'rgba(255,255,255,0.2)' }} /></div>
            </div>
            <div style={{ height: 76, borderRadius: 16, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', padding: 10, display: 'grid', alignContent: 'center', justifyItems: 'center', gap: 4 }}>
              <Users size={16} color="#bfdbfe" />
              <div style={{ color: '#dbeafe', fontSize: 12, fontWeight: 800 }}>FPO pulse</div>
              <div style={{ color: colors.textMuted, fontSize: 10 }}>1,240 members tracked</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (portal.id === 'government') {
    return (
      <div style={frameStyles}>
        <div style={{ padding: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: colors.textSecondary, fontSize: 12, fontWeight: 800 }}>District heatmap</div>
          <div style={{ color: palette, fontSize: 11, fontWeight: 800 }}>Maharashtra</div>
        </div>
        <div style={{ padding: 14, display: 'grid', gap: 12 }}>
          <div style={{ height: 150, borderRadius: 20, position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(14, 31, 20, 0.95), rgba(7, 20, 13, 0.92))', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 25% 30%, rgba(245, 158, 11, 0.4), transparent 28%), radial-gradient(circle at 68% 26%, rgba(239, 68, 68, 0.34), transparent 22%), radial-gradient(circle at 58% 72%, rgba(16,185,129,0.38), transparent 24%), radial-gradient(circle at 22% 74%, rgba(59,130,246,0.26), transparent 18%)' }} />
            <div style={{ position: 'absolute', inset: '12%', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', transform: 'skewX(-10deg)', background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }} />
            <div style={{ position: 'absolute', left: 18, bottom: 18, padding: '7px 10px', borderRadius: 999, background: 'rgba(6,15,9,0.72)', border: '1px solid rgba(245,158,11,0.18)', color: '#fef3c7', fontSize: 11, fontWeight: 800 }}>
              5 districts active
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: 10, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: colors.textMuted, fontSize: 10 }}>Climate risk</div>
              <div style={{ marginTop: 6, color: '#fde68a', fontSize: 18, fontWeight: 900 }}>Moderate</div>
            </div>
            <div style={{ padding: 10, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: colors.textMuted, fontSize: 10 }}>Scheme reach</div>
              <div style={{ marginTop: 6, color: '#d1fae5', fontSize: 18, fontWeight: 900 }}>78%</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={frameStyles}>
      <div style={{ padding: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: colors.textSecondary, fontSize: 12, fontWeight: 800 }}>Loan recommendation</div>
        <div style={{ color: palette, fontSize: 11, fontWeight: 800 }}>AI risk score</div>
      </div>
      <div style={{ padding: 14, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', margin: '0 auto', background: `conic-gradient(${palette} 0 312deg, rgba(255,255,255,0.08) 312deg 360deg)`, display: 'grid', placeItems: 'center', boxShadow: `0 0 24px ${palette}22` }}>
            <div style={{ width: 78, height: 78, borderRadius: '50%', background: 'rgba(6,15,9,0.92)', display: 'grid', placeItems: 'center', color: '#dbeafe', fontWeight: 900 }}>87</div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ padding: 10, borderRadius: 16, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)' }}>
              <div style={{ color: '#dbeafe', fontSize: 11, fontWeight: 700 }}>Crop health score</div>
              <div style={{ color: colors.textMuted, fontSize: 11, marginTop: 3 }}>Stable moisture and healthy NDVI trend.</div>
            </div>
            <div style={{ padding: 10, borderRadius: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
              <div style={{ color: '#d1fae5', fontSize: 11, fontWeight: 700 }}>Loan recommendation</div>
              <div style={{ color: colors.textMuted, fontSize: 11, marginTop: 3 }}>Approved with preferred terms.</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 12px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ color: colors.textMuted, fontSize: 11 }}>Expected yield uplift</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: colors.textPrimary, fontWeight: 900 }}>
            <IndianRupee size={13} />1.8L
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Portal Card ─────────────────────────────────────────────────────────────

function PortalCard({ portal, onOpen }) {
  return (
    <motion.button
      type="button"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
      onClick={() => onOpen(portal.path)}
      style={{
        textAlign: 'left',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '28px',
        background: 'linear-gradient(180deg, rgba(10, 24, 16, 0.94), rgba(6, 14, 10, 0.98))',
        padding: 18,
        color: colors.textPrimary,
        cursor: 'pointer',
        boxShadow: `0 24px 48px -34px ${portal.color}88`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 452,
        display: 'grid',
        alignContent: 'start',
        gap: 14,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at top left, ${portal.color}22, transparent 46%), radial-gradient(circle at bottom right, rgba(255,255,255,0.03), transparent 34%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ color: portal.color, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{portal.eyebrow}</div>
          <h3 style={{ margin: '8px 0 6px', fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.03em' }}>{portal.title}</h3>
          <p style={{ margin: 0, color: colors.textMuted, fontSize: typography.sm, lineHeight: 1.55, maxWidth: 320 }}>{portal.description}</p>
        </div>
        <div style={{ minWidth: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: `${portal.color}18`, border: `1px solid ${portal.color}2e`, color: portal.color, flexShrink: 0 }}>
          {portal.id === 'farmer' && <Sprout size={20} />}
          {portal.id === 'admin' && <Users size={20} />}
          {portal.id === 'government' && <Landmark size={20} />}
          {portal.id === 'bank' && <Building2 size={20} />}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <PortalPreview portal={portal} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {portal.bullets.map((item) => (
          <div key={item} style={{ padding: '7px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: colors.textSecondary, fontSize: 11, fontWeight: 700 }}>
            {item}
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'grid', gap: 3 }}>
          <div style={{ color: colors.textMuted, fontSize: 11 }}>Enter portal</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: portal.color, fontWeight: 800, fontSize: 14 }}>
            Explore the workspace <ArrowRight size={15} />
          </div>
        </div>
        <div style={{ padding: '8px 10px', borderRadius: 999, background: `${portal.color}14`, border: `1px solid ${portal.color}22`, color: portal.color, fontSize: 11, fontWeight: 800 }}>
          {portal.badge}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Hero Showcase Visual ─────────────────────────────────────────────────────
// Pure CSS + SVG animated scene. No Leaflet. Visual hierarchy:
//   Largest:   Farm scene (full panel)
//   Secondary: AI Advisory Card
//   Tertiary:  Weather + NDVI status pills

function HeroShowcaseVisual() {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 34,
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        boxShadow: '0 40px 80px -32px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04) inset',
        background: '#0a1a0e',
        aspectRatio: '4/5',
        minHeight: 560,
      }}
    >
      {/* ── Base farmland image ─────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src={FARMLAND_IMG}
          alt="Aerial farmland satellite view"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Dark vignette so overlays pop */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(4,10,7,0.25) 0%, rgba(4,10,7,0.12) 35%, rgba(4,10,7,0.55) 80%, rgba(4,10,7,0.82) 100%)' }} />
      </div>

      {/* ── SVG layer: farm boundary + NDVI zones + satellite + beam ────── */}
      <svg
        viewBox="0 0 420 520"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
        preserveAspectRatio="xMidYMid slice"
        overflow="visible"
      >
        <defs>
          {/* Scanning beam gradient */}
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.0" />
            <stop offset="40%" stopColor="#a7f3d0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.12" />
          </linearGradient>
          {/* NDVI zone clip — farm polygon */}
          <clipPath id="farmClip">
            <polygon points="120,160 230,120 310,200 290,340 180,360 100,280" />
          </clipPath>
          {/* Satellite glow filter */}
          <filter id="satGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Scan line glow */}
          <filter id="lineGlow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* NDVI Heatmap zones (clipped to farm boundary) */}
        {/* Healthy green zone */}
        <ellipse cx="185" cy="220" rx="65" ry="55" fill="#22c55e" fillOpacity="0.38" clipPath="url(#farmClip)" />
        {/* Moderate yellow zone */}
        <ellipse cx="255" cy="265" rx="48" ry="42" fill="#facc15" fillOpacity="0.42" clipPath="url(#farmClip)" />
        {/* Stress red zone */}
        <ellipse cx="150" cy="305" rx="38" ry="32" fill="#ef4444" fillOpacity="0.38" clipPath="url(#farmClip)" />
        {/* Another healthy patch */}
        <ellipse cx="210" cy="180" rx="30" ry="26" fill="#4ade80" fillOpacity="0.28" clipPath="url(#farmClip)" />

        {/* Farm boundary polygon — white dashed */}
        <polygon
          points="120,160 230,120 310,200 290,340 180,360 100,280"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
          strokeDasharray="8 5"
        />
        {/* Boundary corner dots */}
        {[[120,160],[230,120],[310,200],[290,340],[180,360],[100,280]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="white" fillOpacity="0.85" />
        ))}

        {/* Farm center pin */}
        <g transform="translate(200,245)">
          <circle r="14" fill="#22c55e" fillOpacity="0.18" />
          <circle r="7" fill="#22c55e" fillOpacity="0.9" />
          <circle r="3.5" fill="white" />
        </g>

        {/* ── Scanning beam (animated) ──────────────────────────── */}
        <motion.g
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <polygon
            points="315,30 315,30 200,245 200,245"
            fill="url(#beamGrad)"
            style={{ transformOrigin: '315px 30px' }}
          />
          {/* Beam edges */}
          <line x1="315" y1="30" x2="140" y2="250" stroke="#a7f3d0" strokeWidth="0.8" strokeOpacity="0.35" />
          <line x1="315" y1="30" x2="260" y2="240" stroke="#a7f3d0" strokeWidth="0.8" strokeOpacity="0.35" />
        </motion.g>

        {/* Horizontal scan sweep line — use rect+translateY since framer-motion
            cannot animate SVG presentation attributes like y1/y2 */}
        <motion.rect
          x="88"
          y="0"
          width="236"
          height="3"
          rx="1.5"
          fill="#a7f3d0"
          fillOpacity="0.9"
          filter="url(#lineGlow)"
          style={{ originX: '50%', originY: '50%' }}
          animate={{ y: [155, 362, 155] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Satellite (top-right corner, orbiting) ────────────── */}
        <motion.g
          filter="url(#satGlow)"
          animate={{ x: [0, 6, -4, 0], y: [0, -4, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Satellite body */}
          <rect x="298" y="18" width="34" height="16" rx="4" fill="rgba(226,232,240,0.92)" />
          {/* Solar panels */}
          <rect x="270" y="22" width="26" height="9" rx="3" fill="#60a5fa" fillOpacity="0.9" />
          <rect x="334" y="22" width="26" height="9" rx="3" fill="#60a5fa" fillOpacity="0.9" />
          {/* Antenna */}
          <line x1="315" y1="18" x2="315" y2="10" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <circle cx="315" cy="8" r="2.5" fill="#a7f3d0" fillOpacity="0.9" />
          {/* Signal pulse — use CSS scale instead of SVG r attribute */}
          <motion.circle
            cx="315" cy="8" r="8"
            fill="none" stroke="#a7f3d0" strokeWidth="1"
            style={{ originX: '315px', originY: '8px' }}
            animate={{ scale: [0.6, 1.5], opacity: [0.8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.g>

        {/* Orbit arc (subtle) */}
        <ellipse
          cx="210"
          cy="26"
          rx="120"
          ry="18"
          fill="none"
          stroke="rgba(167,243,208,0.15)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      </svg>

      {/* ── Tertiary: Sentinel-2 pill (top-left) ─────────────────────────── */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
        }}
      >
        <div style={{
          padding: '7px 12px',
          borderRadius: 999,
          background: 'rgba(6,15,9,0.78)',
          border: '1px solid rgba(52,211,153,0.28)',
          color: '#d1fae5',
          fontSize: 11,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          backdropFilter: 'blur(12px)',
        }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px rgba(52,211,153,0.9)' }}
          />
          Sentinel-2 L2A · Live
        </div>
        <div style={{
          padding: '7px 12px',
          borderRadius: 999,
          background: 'rgba(6,15,9,0.78)',
          border: '1px solid rgba(250,204,21,0.22)',
          color: '#fef3c7',
          fontSize: 11,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          backdropFilter: 'blur(12px)',
        }}>
          <span style={{ fontSize: 13 }}>🌤</span>
          31°C · Partly Cloudy · Rain 64%
        </div>
      </motion.div>

      {/* ── Primary Secondary: AI Advisory Card (dominant, bottom-right) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 18,
          width: 238,
          zIndex: 5,
          borderRadius: 22,
          background: 'rgba(6,15,9,0.88)',
          border: '1px solid rgba(52,211,153,0.28)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 24px 48px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(52,211,153,0.1) inset',
          overflow: 'hidden',
        }}
      >
        {/* Card header */}
        <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.2)', display: 'grid', placeItems: 'center' }}>
              <Zap size={13} color="#34d399" />
            </div>
            <div>
              <div style={{ color: '#d1fae5', fontSize: 11, fontWeight: 800 }}>AI Advisory</div>
              <div style={{ color: colors.textMuted, fontSize: 9, marginTop: 1 }}>Kisan Sarthi Intelligence</div>
            </div>
          </div>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px rgba(52,211,153,0.8)' }}
          />
        </div>

        {/* NDVI score row */}
        <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ color: colors.textMuted, fontSize: 10, fontWeight: 700 }}>NDVI Score</div>
            <div style={{ color: '#4ade80', fontSize: 14, fontWeight: 900 }}>0.72 <span style={{ fontSize: 10, color: '#86efac' }}>Healthy</span></div>
          </div>
          {/* Colour strip */}
          <div style={{ height: 5, borderRadius: 999, background: 'linear-gradient(90deg, #ef4444 0%, #facc15 40%, #22c55e 72%, #4ade80 100%)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '68%', top: -3, width: 11, height: 11, borderRadius: '50%', background: 'white', border: '2px solid #22c55e', transform: 'translateX(-50%)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, color: colors.textMuted, fontSize: 9 }}>
            <span>Stress</span><span>Moderate</span><span>Healthy</span>
          </div>
        </div>

        {/* Advisory message */}
        <div style={{ padding: '10px 14px' }}>
          <div style={{ color: '#d1fae5', fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
            🌧 Rain expected in <strong style={{ color: '#a7f3d0' }}>48 hours</strong>. Delay irrigation & monitor for pest activity.
          </div>
          {/* Action chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {['Delay irrigation', 'Pest check', 'View forecast'].map(chip => (
              <div key={chip} style={{ padding: '4px 9px', borderRadius: 999, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.18)', color: '#a7f3d0', fontSize: 10, fontWeight: 700 }}>
                {chip}
              </div>
            ))}
          </div>
          {/* Farmer received notification */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Smartphone size={13} color="#86efac" />
            <div>
              <div style={{ color: '#86efac', fontSize: 10, fontWeight: 800 }}>Farmer notified</div>
              <div style={{ color: colors.textMuted, fontSize: 9 }}>Push sent · 2 min ago</div>
            </div>
            <CheckCircle size={13} color="#34d399" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </motion.div>

      {/* ── Tertiary: NDVI legend pill (bottom-left) ─────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: 18,
        zIndex: 4,
        padding: '8px 12px',
        borderRadius: 14,
        background: 'rgba(6,15,9,0.78)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}>
        <div style={{ color: colors.textMuted, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>NDVI</div>
        {[['#22c55e', 'Healthy'], ['#facc15', 'Moderate'], ['#ef4444', 'Stress']].map(([c, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: colors.textSecondary }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Workflow Breadcrumb Strip ────────────────────────────────────────────────

function WorkflowStrip() {
  const steps = [
    { emoji: '🛰', label: 'Satellite' },
    { emoji: '🌾', label: 'Farm' },
    { emoji: '🤖', label: 'AI Analysis' },
    { emoji: '📱', label: 'Alert' },
    { emoji: '📈', label: 'Better Yield' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', rowGap: 8 }}>
      {steps.map((step, i) => (
        <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3, duration: 0.4, ease: 'easeOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: colors.textSecondary,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 14 }}>{step.emoji}</span>
            {step.label}
          </motion.div>
          {i < steps.length - 1 && (
            <div style={{ padding: '0 6px', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>→</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Platform Features Section ────────────────────────────────────────────────

const platformFeatures = [
  { icon: Satellite, label: 'Sentinel-2 Imagery', desc: '5-day revisit, 10m resolution crop monitoring', color: '#38bdf8' },
  { icon: Leaf, label: 'NDVI Monitoring', desc: 'Vegetation health and stress detection per parcel', color: '#22c55e' },
  { icon: Zap, label: 'AI Advisory Engine', desc: 'Localized crop recommendations in regional language', color: '#a78bfa' },
  { icon: CloudRain, label: 'Climate Risk Alerts', desc: 'Real-time weather events and 7-day risk scoring', color: '#60a5fa' },
  { icon: CreditCard, label: 'Loan Intelligence', desc: 'Satellite-backed credit scoring for rural finance', color: '#f59e0b' },
  { icon: Globe, label: 'Scheme Targeting', desc: 'Government scheme reach mapping at district level', color: '#fb923c' },
];

function PlatformFeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <section ref={ref} style={{ marginTop: 22 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ color: '#34d399', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
          Platform Capabilities
        </div>
        <div style={{ color: colors.textPrimary, fontSize: 'clamp(1.4rem, 2.4vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>
          Everything your farm needs. From orbit.
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 14 }}>
        {platformFeatures.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
              style={{
                padding: '18px 16px',
                borderRadius: 22,
                background: 'linear-gradient(180deg, rgba(10,24,16,0.9), rgba(6,14,10,0.98))',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'grid',
                gap: 10,
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 12, background: `${feat.color}14`, border: `1px solid ${feat.color}28`, display: 'grid', placeItems: 'center', color: feat.color }}>
                <Icon size={18} />
              </div>
              <div>
                <div style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 800, marginBottom: 5 }}>{feat.label}</div>
                <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.5 }}>{feat.desc}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();

  const metrics = [
    { value: 20, label: 'Farmers Monitored', suffix: '' },
    { value: 30, label: 'Active Fields', suffix: '' },
    { value: 5, label: 'Districts Covered', suffix: '' },
    { value: 92, label: 'Advisory Accuracy', suffix: '%' },
  ];

  const platformFlow = [
    { label: 'Satellite Data', icon: Satellite, detail: 'Sentinel-2 imagery ingested every 5 days' },
    { label: 'Field Monitoring', icon: Target, detail: 'Boundary detection and NDVI change tracking' },
    { label: 'AI Advisory', icon: Zap, detail: 'Localized recommendations from risk signals' },
    { label: 'Farmer Alert', icon: Signal, detail: 'Push-ready guidance delivered to mobile' },
    { label: 'Better Yield', icon: TrendingUp, detail: 'Improved outcomes through timely intervention' },
  ];

  const portals = [
    {
      id: 'farmer',
      title: 'Farmer Portal',
      eyebrow: 'Mobile decision support',
      description: 'Crop health, field advisory, and irrigation scheduling — in the farmer\'s own language.',
      path: '/farmer',
      icon: Sprout,
      color: '#22c55e',
      badge: 'Mobile-first',
      bullets: ['Crop health score', 'NDVI advisory', 'Irrigation schedule'],
    },
    {
      id: 'admin',
      title: 'Admin & FPO Dashboard',
      eyebrow: 'Monitoring command center',
      description: 'Operational oversight across all fields, farmers, and alerts in your region.',
      path: '/admin',
      icon: Users,
      color: '#14b8a6',
      badge: 'Operations',
      bullets: ['Monitoring dashboard', 'Farm alerts', 'FPO pulse'],
    },
    {
      id: 'government',
      title: 'Government Intelligence',
      eyebrow: 'District policy intelligence',
      description: 'Heatmaps, climate risk scores, and scheme targeting at district scale.',
      path: '/government',
      icon: Landmark,
      color: '#f59e0b',
      badge: 'District view',
      bullets: ['District heatmap', 'Climate risk', 'Scheme reach'],
    },
    {
      id: 'bank',
      title: 'Bank & Credit Dashboard',
      eyebrow: 'Financial inclusion engine',
      description: 'Satellite-backed crop scores to inform rural lending and insurance decisions.',
      path: '/bank',
      icon: Building2,
      color: '#38bdf8',
      badge: 'Credit intelligence',
      bullets: ['Crop health score', 'Loan recommendation', 'Yield forecast'],
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 18% 14%, rgba(34,197,94,0.16), transparent 22%), radial-gradient(circle at 82% 12%, rgba(56,189,248,0.12), transparent 20%), linear-gradient(180deg, #040a06 0%, #07110a 38%, #050b08 100%)',
        color: colors.textPrimary,
        fontFamily: typography.fontFamily,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '110px 110px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent 88%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1440, margin: '0 auto', padding: '32px 24px 40px' }}>

        {/* ── SECTION 1: HERO ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 36,
            alignItems: 'center',
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          {/* LEFT: Narrative text panel */}
          <div style={{ display: 'grid', alignContent: 'center', gap: 28, padding: '24px 0 8px' }}>
            {/* Eyebrow badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <div style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(52,211,153,0.28)', background: 'rgba(6,15,9,0.72)', color: '#d1fae5', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Satellite Farm Intelligence
              </div>
              <div style={{ padding: '8px 13px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: colors.textSecondary, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 14px rgba(52,211,153,0.7)' }}
                />
                Live · Sentinel-2 + AI
              </div>
            </div>

            {/* Headline */}
            <div style={{ display: 'grid', gap: 12 }}>
              <h1 style={{
                margin: 0,
                color: colors.textPrimary,
                fontSize: 'clamp(3.2rem, 7vw, 5.8rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.07em',
              }}>
                Kisan Sarthi
              </h1>
              <div style={{ color: '#34d399', fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                Every farm. Seen from orbit.
              </div>
              <p style={{ margin: 0, color: colors.textMuted, fontSize: '1.02rem', lineHeight: 1.7, maxWidth: 560 }}>
                Satellite data streams into AI that turns crop health into plain-language advisories — delivered to the farmer before the risk becomes a loss.
              </p>
            </div>

            {/* Workflow breadcrumb */}
            <WorkflowStrip />

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('portals-section')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '14px 24px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  color: '#f0fdf4',
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  boxShadow: '0 14px 32px -10px rgba(34,197,94,0.45)',
                  fontFamily: 'inherit',
                }}
              >
                Explore Portals <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.06)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '14px 22px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: colors.textSecondary,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  fontFamily: 'inherit',
                }}
              >
                See How It Works
              </motion.button>
            </div>

            {/* Metrics strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10 }}>
              {metrics.map((metric) => (
                <div key={metric.label} style={{
                  padding: '14px 12px',
                  borderRadius: 18,
                  background: 'linear-gradient(180deg, rgba(10,24,16,0.9), rgba(6,14,10,0.98))',
                  border: '1px solid rgba(255,255,255,0.07)',
                  textAlign: 'center',
                }}>
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} fontSize="1.85rem" color={colors.textPrimary} style={{ lineHeight: 1 }} />
                  <div style={{ marginTop: 6, color: colors.textMuted, fontSize: 10, fontWeight: 700, lineHeight: 1.35 }}>{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Hero Showcase Visual */}
          <div style={{ display: 'grid', alignContent: 'center' }}>
            <HeroShowcaseVisual />
          </div>
        </motion.section>

        {/* ── SECTION 2: HOW Kisan Sarthi WORKS ──────────────────────────────── */}
        <section id="how-it-works" style={{ marginTop: 32 }}>
          {/* Centered heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            <div style={{ color: '#34d399', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
              How Kisan Sarthi Works
            </div>
            <div style={{ color: colors.textPrimary, fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>
              From orbit to advisory in minutes
            </div>
            <div style={{ color: colors.textMuted, fontSize: '1rem', lineHeight: 1.65, maxWidth: 560, margin: '12px auto 0' }}>
              A continuous intelligence loop that transforms raw satellite data into crop-specific, field-level guidance.
            </div>
          </motion.div>

          {/* 5-step flow */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: 0,
              position: 'relative',
            }}
          >
            {/* Connector track */}
            <div style={{
              position: 'absolute',
              top: 44,
              left: '10%',
              right: '10%',
              height: 2,
              background: 'linear-gradient(90deg, rgba(52,211,153,0.08), rgba(52,211,153,0.28) 50%, rgba(52,211,153,0.08))',
              zIndex: 0,
            }} />

            {platformFlow.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === platformFlow.length - 1;
              return (
                <motion.div
                  key={step.label}
                  variants={staggerItem}
                  style={{
                    display: 'grid',
                    alignContent: 'start',
                    gap: 12,
                    padding: '0 10px',
                    position: 'relative',
                    zIndex: 1,
                    textAlign: 'center',
                  }}
                >
                  {/* Step number + icon bubble */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: 18,
                      background: isLast
                        ? 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(16,185,129,0.14))'
                        : 'rgba(255,255,255,0.035)',
                      border: isLast
                        ? '1px solid rgba(34,197,94,0.32)'
                        : '1px solid rgba(255,255,255,0.07)',
                      display: 'grid',
                      placeItems: 'center',
                      color: isLast ? '#34d399' : colors.textSecondary,
                      boxShadow: isLast ? '0 8px 24px -8px rgba(34,197,94,0.3)' : 'none',
                    }}>
                      <Icon size={20} />
                    </div>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: colors.textMuted,
                      letterSpacing: '0.06em',
                    }}>
                      0{index + 1}
                    </div>
                  </div>

                  {/* Label + detail */}
                  <div style={{ padding: '12px 10px', borderRadius: 18, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: colors.textPrimary, fontWeight: 800, fontSize: 13, lineHeight: 1.3, marginBottom: 6 }}>
                      {step.label}
                    </div>
                    <div style={{ color: colors.textMuted, fontSize: 11, lineHeight: 1.5 }}>
                      {step.detail}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── SECTION 3: ROLE PORTALS ─────────────────────────────────────── */}
        <motion.section
          id="portals-section"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.15 }}
          style={{ marginTop: 32 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'end', marginBottom: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#34d399', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Role Portals</div>
              <div style={{ color: colors.textPrimary, fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.04em', marginTop: 8 }}>
                Choose Your Portal
              </div>
              <div style={{ color: colors.textMuted, fontSize: 13, marginTop: 6 }}>
                Four stakeholder lenses. One intelligence backbone.
              </div>
            </div>
            <div style={{ color: colors.textMuted, fontSize: 13, maxWidth: 480, lineHeight: 1.6 }}>
              Every portal shares the same satellite, AI, climate and financial intelligence — tuned for what each stakeholder needs to act.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18 }}>
            {portals.map((portal) => (
              <motion.div key={portal.id} variants={staggerItem}>
                <PortalCard portal={portal} onOpen={navigate} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── SECTION 4: PLATFORM FEATURES ────────────────────────────────── */}
        <PlatformFeaturesSection />

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: 28,
            padding: '18px 0 10px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div style={{ color: colors.textMuted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={14} />
            Powered by a live agricultural intelligence stack for national-scale decision making.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Sentinel-2', 'AI Advisory', 'Climate Intelligence', 'Market Intelligence', 'Government Schemes'].map((item) => (
              <div key={item} style={{ padding: '7px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: colors.textSecondary, fontSize: 11, fontWeight: 700 }}>
                {item}
              </div>
            ))}
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

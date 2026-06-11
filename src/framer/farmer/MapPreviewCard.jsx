import { motion } from 'framer-motion';
import { colors, typography } from '../shared';
import FramerCard from '../shared/FramerCard';
import { Satellite, MapPin, ArrowRight } from '../shared/icons';

export default function MapPreviewCard({ t, onNavigate }) {
  // Demo Nashik plot coordinates centroid
  const plot = {
    district: 'Nashik',
    crop: 'Wheat',
    lat: 20.00,
    lon: 73.70,
  };

  return (
    <FramerCard glowing padding="0" style={{ overflow: 'hidden', marginBottom: '16px' }}>
      {/* Visual map preview canvas container */}
      <div style={{
        height: '110px',
        position: 'relative',
        background: '#040d06',
        backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 0)',
        backgroundSize: '12px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Styled GIS polygon preview */}
        <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%', opacity: 0.85 }}>
          {/* District boundary line outline */}
          <path d="M 20 10 Q 100 30 180 10" fill="none" stroke={`${colors.primary}22`} strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 10 90 Q 90 70 190 85" fill="none" stroke={`${colors.primary}22`} strokeWidth="1" strokeDasharray="3 3" />

          {/* Farm boundary polygon */}
          <motion.polygon
            points="70,30 130,25 140,75 80,70"
            fill="rgba(16, 185, 129, 0.25)"
            stroke={colors.success}
            strokeWidth="1.5"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* District text */}
          <text x="100" y="90" textAnchor="middle" fill={colors.textDim} fontSize="8" fontFamily={typography.fontFamily}>
            Nashik District Sector B
          </text>

          {/* Center target indicator */}
          <circle cx="105" cy="50" r="3" fill="#fff" />
          <circle cx="105" cy="50" r="8" fill="none" stroke={colors.success} strokeWidth="1" />
        </svg>

        {/* Floating badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(10, 24, 16, 0.85)',
          border: `1px solid ${colors.border}`,
          borderRadius: '20px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '9px',
          fontWeight: typography.bold,
          color: colors.textSecondary,
          fontFamily: typography.fontFamily,
          backdropFilter: 'blur(4px)'
        }}>
          <Satellite size={10} color={colors.primaryLight} />
          <span>Sentinel-2 L2A telemetry active</span>
        </div>
      </div>

      {/* Info footer with CTA */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: typography.fontFamily,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} color={colors.primaryLight} />
          <div>
            <span style={{ fontSize: typography.xs, color: colors.textPrimary, fontWeight: typography.semibold, display: 'block' }}>
              Field Map Preview
            </span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>
              {plot.crop} · {plot.lat}°N, {plot.lon}°E
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('fieldMap')}
          style={{
            background: `${colors.primary}18`,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            color: colors.primaryLight,
            padding: '6px 12px',
            fontSize: typography.xs,
            fontWeight: typography.semibold,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: typography.fontFamily,
          }}
        >
          <span>Open Full Map</span>
          <ArrowRight size={12} />
        </motion.button>
      </div>
    </FramerCard>
  );
}

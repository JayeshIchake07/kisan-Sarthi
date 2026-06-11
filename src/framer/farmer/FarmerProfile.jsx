import { motion } from 'framer-motion';
import { D } from '@/data/seedData';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import { User, Phone, MapPin, Sprout, Languages, Settings, LogOut, ChevronRight } from '../shared/icons';

const farmer = D.plots[0];

/**
 * Farmer Profile screen — personal info, farm details, language settings.
 */
export default function FarmerProfile({ t }) {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Avatar & Name */}
      <motion.div variants={staggerItem} style={{ textAlign: 'center', marginBottom: '20px' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: typography['2xl'], fontWeight: typography.bold,
            color: '#fff', fontFamily: typography.fontFamily,
            boxShadow: `0 0 30px ${colors.primaryGlow}`,
          }}
        >
          {farmer.initials}
        </motion.div>
        <h2 style={{
          fontSize: typography.xl, fontWeight: typography.bold,
          color: colors.textPrimary, margin: '0 0 4px', fontFamily: typography.fontFamily,
        }}>
          {farmer.farmer}
        </h2>
        <p style={{
          fontSize: typography.sm, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily,
        }}>
          Plot #{farmer.id} · {farmer.district}
        </p>
      </motion.div>

      {/* Personal Info */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textMuted, margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          {t('personalInfo')}
        </h3>
        <FramerCard padding="0">
          {[
            { icon: User, label: t('name'), value: farmer.farmer },
            { icon: Phone, label: t('phone'), value: farmer.phone },
            { icon: MapPin, label: t('district'), value: farmer.district },
            { icon: Languages, label: t('language'), value: farmer.lang === 'mr' ? 'Marathi' : 'Hindi' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
              borderBottom: i < 3 ? `1px solid ${colors.borderLight}` : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: `${colors.primary}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <item.icon size={16} color={colors.textMuted} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily,
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontSize: typography.sm, fontWeight: typography.medium,
                  color: colors.textPrimary, margin: '2px 0 0', fontFamily: typography.fontFamily,
                }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </FramerCard>
      </motion.div>

      {/* Farm Details */}
      <motion.div variants={staggerItem} style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textMuted, margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          {t('farmDetails')}
        </h3>
        <FramerCard padding="0">
          {[
            { label: t('crop'), value: farmer.crop },
            { label: t('acres'), value: `${farmer.acres} acres` },
            { label: 'NDVI', value: farmer.ndvi.toFixed(3) },
            { label: 'Location', value: `${farmer.lat}°N, ${farmer.lon}°E` },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px',
              borderBottom: i < 3 ? `1px solid ${colors.borderLight}` : 'none',
              fontSize: typography.sm, fontFamily: typography.fontFamily,
            }}>
              <span style={{ color: colors.textMuted }}>{item.label}</span>
              <span style={{ color: colors.textPrimary, fontWeight: typography.medium }}>{item.value}</span>
            </div>
          ))}
        </FramerCard>
      </motion.div>

      {/* Settings Menu */}
      <motion.div variants={staggerItem}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold,
          color: colors.textMuted, margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          {t('settings')}
        </h3>
        <FramerCard padding="0">
          {[
            { icon: Settings, label: t('appSettings'), color: colors.textMuted },
            { icon: LogOut, label: t('signOut'), color: colors.danger },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ background: colors.bgLighter }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                borderBottom: i < 1 ? `1px solid ${colors.borderLight}` : 'none',
                cursor: 'pointer',
              }}
            >
              <item.icon size={18} color={item.color} />
              <span style={{
                flex: 1, fontSize: typography.sm, color: item.color,
                fontFamily: typography.fontFamily,
              }}>
                {item.label}
              </span>
              <ChevronRight size={16} color={colors.textDim} />
            </motion.div>
          ))}
        </FramerCard>
      </motion.div>
    </motion.div>
  );
}

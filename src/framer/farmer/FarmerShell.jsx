import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { colors, typography } from '../shared';
import {
  Home, Map, Sprout, Landmark, Menu, TrendingUp,
  CloudLightning, CreditCard, User, Bell, Languages, X
} from '../shared/icons';
import FarmerHome from './FarmerHome';
import AIAdvisory from './AIAdvisory';
import MarketPrices from './MarketPrices';
import ClimateAlerts from './ClimateAlerts';
import LoanApplication from './LoanApplication';
import Schemes from './Schemes';
import FarmerProfile from './FarmerProfile';
import Notifications from './Notifications';

const FieldHealthMap = lazy(() => import('./FieldHealthMap'));

const SCREENS = {
  home: FarmerHome,
  fieldMap: FieldHealthMap,
  advisory: AIAdvisory,
  market: MarketPrices,
  climate: ClimateAlerts,
  loan: LoanApplication,
  schemes: Schemes,
  profile: FarmerProfile,
  notifications: Notifications,
};

const ScreenFallback = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '250px', gap: '12px', color: colors.textSecondary, fontFamily: typography.fontFamily
  }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{ width: 28, height: 28, borderRadius: '50%', border: `3px solid ${colors.primary}20`, borderTopColor: colors.primary }}
    />
    <span style={{ fontSize: typography.xs }}>Loading screen...</span>
  </div>
);

/**
 * Farmer mobile app shell with bottom nav, More slide tray, and page transitions.
 */
export default function FarmerShell() {
  const [tab, setTab] = useState('home');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { t, cycleLang, langLabel } = useLanguage();
  const Screen = SCREENS[tab];

  // 4 Primary bottom tabs + 1 More menu button
  const primaryTabs = [
    { id: 'home', label: 'home', icon: Home },
    { id: 'fieldMap', label: 'fieldHealth', icon: Map },
    { id: 'advisory', label: 'aiAdvisory', icon: Sprout },
    { id: 'schemes', label: 'schemes', icon: Landmark },
  ];

  // Rest of the tabs housed inside the glassmorphic "More" drawer
  const secondaryTabs = [
    { id: 'market', label: 'market', icon: TrendingUp },
    { id: 'climate', label: 'climate', icon: CloudLightning },
    { id: 'loan', label: 'loan', icon: CreditCard },
    { id: 'profile', label: 'profile', icon: User },
    { id: 'notifications', label: 'notifications', icon: Bell },
  ];

  const handleTabChange = (id) => {
    setTab(id);
    setShowMoreMenu(false);
  };

  const isMoreActive = secondaryTabs.some(st => st.id === tab);

  return (
    <div className="framer-app">
      <div className="farmer-shell">
        
        {/* Header */}
        <div className="farmer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>🛰️</span>
            <div>
              <h1 style={{
                fontSize: typography.base, fontWeight: typography.bold,
                color: colors.textPrimary, margin: 0,
                fontFamily: typography.fontFamily,
              }}>
                Kisan Sarthi
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={cycleLang}
              style={{
                background: `${colors.primary}20`, border: `1px solid ${colors.border}`,
                borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
                color: colors.textSecondary, fontSize: typography.xs,
                fontWeight: typography.semibold, fontFamily: typography.fontFamily,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              <Languages size={14} />
              {langLabel}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTabChange('notifications')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: tab === 'notifications' ? colors.primaryLight : colors.textSecondary,
                position: 'relative', padding: '4px',
              }}
            >
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: 0, right: 0,
                width: 8, height: 8, borderRadius: '50%',
                background: colors.danger,
              }} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTabChange('profile')}
              style={{
                background: tab === 'profile' ? colors.primary : `${colors.primary}30`,
                border: 'none', cursor: 'pointer',
                color: colors.textPrimary, width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: typography.xs, fontWeight: typography.bold,
                fontFamily: typography.fontFamily,
              }}
            >
              RP
            </motion.button>
          </div>
        </div>

        {/* Content with page transitions */}
        <div className="farmer-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Suspense fallback={<ScreenFallback />}>
                <Screen t={t} onNavigate={handleTabChange} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* More sliding tray (Glassmorphic) */}
        <AnimatePresence>
          {showMoreMenu && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMoreMenu(false)}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: '#000000', zIndex: 101,
                }}
              />

              {/* Slider panel */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(10, 24, 16, 0.95)',
                  backdropFilter: 'blur(25px)',
                  borderTop: `1px solid ${colors.border}`,
                  borderRadius: '20px 20px 0 0',
                  padding: '20px 20px 40px',
                  zIndex: 102,
                  boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: typography.sm, fontWeight: typography.bold, color: colors.textSecondary, fontFamily: typography.fontFamily }}>
                    {t('moreActions')}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMoreMenu(false)}
                    style={{
                      background: 'rgba(255,255,255,0.06)', border: 'none',
                      width: 28, height: 28, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: colors.textMuted, cursor: 'pointer'
                    }}
                  >
                    <X size={14} />
                  </motion.button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {secondaryTabs.map((s) => (
                    <motion.button
                      key={s.id}
                      onClick={() => handleTabChange(s.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: tab === s.id ? `${colors.primary}20` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${tab === s.id ? colors.primary : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: '12px', padding: '16px 8px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <s.icon size={20} color={tab === s.id ? colors.primaryLight : colors.textMuted} />
                      <span style={{
                        fontSize: '10px', fontWeight: typography.medium,
                        color: tab === s.id ? colors.textPrimary : colors.textSecondary,
                        fontFamily: typography.fontFamily,
                      }}>
                        {t(s.label)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom navigation */}
        <div className="farmer-bottom-nav">
          {primaryTabs.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              className={`farmer-nav-btn ${tab === id ? 'active' : ''}`}
              onClick={() => handleTabChange(id)}
              whileTap={{ scale: 0.85 }}
            >
              <Icon size={20} />
              <span>{t(label)}</span>
              {tab === id && (
                <motion.div
                  layoutId="farmer-tab-indicator"
                  style={{
                    position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
                    width: 20, height: 3, borderRadius: 2,
                    background: colors.primary,
                  }}
                />
              )}
            </motion.button>
          ))}

          {/* More button */}
          <motion.button
            className={`farmer-nav-btn ${isMoreActive ? 'active' : ''}`}
            onClick={() => setShowMoreMenu(true)}
            whileTap={{ scale: 0.85 }}
          >
            <Menu size={20} />
            <span>{t('more')}</span>
            {isMoreActive && (
              <motion.div
                layoutId="farmer-tab-indicator"
                style={{
                  position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
                  width: 20, height: 3, borderRadius: 2,
                  background: colors.primary,
                }}
              />
            )}
          </motion.button>
        </div>

      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography } from '../shared';
import { sidebarSlide } from '../shared/animations';
import {
  LayoutDashboard, Users, Sprout, MessageSquare, CloudLightning,
  BarChart3, Satellite, ChevronRight
} from '../shared/icons';
import CommandCenter from './CommandCenter';
import FarmerManagement from './FarmerManagement';
import AdvisoryCenter from './AdvisoryCenter';
import BulkCommunication from './BulkCommunication';
import ClimateRiskCenter from './ClimateRiskCenter';
import FPOAnalytics from './FPOAnalytics';

const NAV_ITEMS = [
  { id: 'command', label: 'Command Center', icon: LayoutDashboard },
  { id: 'farmers', label: 'Farmer Management', icon: Users },
  { id: 'advisory', label: 'Advisory Center', icon: Sprout },
  { id: 'comms', label: 'Bulk Communication', icon: MessageSquare },
  { id: 'climate', label: 'Climate Risk', icon: CloudLightning },
  { id: 'analytics', label: 'FPO Analytics', icon: BarChart3 },
];

const SCREENS = {
  command: CommandCenter,
  farmers: FarmerManagement,
  advisory: AdvisoryCenter,
  comms: BulkCommunication,
  climate: ClimateRiskCenter,
  analytics: FPOAnalytics,
};

/**
 * Admin/FPO desktop dashboard shell with sidebar navigation.
 */
export default function AdminShell() {
  const [activeScreen, setActiveScreen] = useState('command');
  const Screen = SCREENS[activeScreen];
  const activeLabel = NAV_ITEMS.find(n => n.id === activeScreen)?.label;

  return (
    <div className="framer-app">
      <div className="framer-dashboard">
        {/* Sidebar */}
        <motion.aside
          className="framer-sidebar"
          variants={sidebarSlide}
          initial="initial"
          animate="animate"
        >
          <div className="framer-sidebar-brand">
            <Satellite size={24} color={colors.primary} />
            <div>
              <h1>Kisan Sarthi</h1>
              <span>FPO Admin Portal</span>
            </div>
          </div>

          <nav className="framer-sidebar-nav">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                className={`framer-sidebar-item ${activeScreen === id ? 'active' : ''}`}
                onClick={() => setActiveScreen(id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={18} />
                {label}
              </motion.button>
            ))}
          </nav>

          <div style={{
            padding: '16px 20px', borderTop: `1px solid ${colors.border}`,
            fontSize: typography.xs, color: colors.textDim, fontFamily: typography.fontFamily,
          }}>
            Kisan Sarthi v2.0 · Nashik Agro FPO
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="framer-main">
          <div className="framer-topbar">
            <h2 style={{ fontFamily: typography.fontFamily }}>{activeLabel}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: typography.xs, color: colors.success, fontFamily: typography.fontFamily,
              }}>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 6, height: 6, borderRadius: '50%', background: colors.success,
                  }}
                />
                Live
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: `${colors.primary}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: typography.sm, fontWeight: typography.bold,
                color: colors.primary, fontFamily: typography.fontFamily,
              }}>
                AK
              </div>
            </div>
          </div>

          <div className="framer-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Screen />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

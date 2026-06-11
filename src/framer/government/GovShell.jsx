import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography } from '../shared';
import { sidebarSlide } from '../shared/animations';
import {
  LayoutDashboard, BarChart3, Bug, IndianRupee, CloudLightning, Landmark
} from '../shared/icons';
import MaharashtraOverview from './MaharashtraOverview';
import DistrictAnalytics from './DistrictAnalytics';
import PestOutbreak from './PestOutbreak';
import SubsidyIntelligence from './SubsidyIntelligence';
import ClimateMonitoring from './ClimateMonitoring';

const NAV_ITEMS = [
  { id: 'overview', label: 'Maharashtra Overview', icon: LayoutDashboard },
  { id: 'districts', label: 'District Analytics', icon: BarChart3 },
  { id: 'pest', label: 'Pest Monitoring', icon: Bug },
  { id: 'subsidy', label: 'Subsidy Intelligence', icon: IndianRupee },
  { id: 'climate', label: 'Climate Monitoring', icon: CloudLightning },
];

const SCREENS = {
  overview: MaharashtraOverview,
  districts: DistrictAnalytics,
  pest: PestOutbreak,
  subsidy: SubsidyIntelligence,
  climate: ClimateMonitoring,
};

/**
 * Government dashboard shell with ministry-styled sidebar.
 */
export default function GovShell() {
  const [activeScreen, setActiveScreen] = useState('overview');
  const Screen = SCREENS[activeScreen];
  const activeLabel = NAV_ITEMS.find(n => n.id === activeScreen)?.label;

  return (
    <div className="framer-app">
      <div className="framer-dashboard">
        <motion.aside
          className="framer-sidebar"
          variants={sidebarSlide}
          initial="initial"
          animate="animate"
          style={{ background: '#071210' }}
        >
          <div className="framer-sidebar-brand" style={{ borderBottomColor: 'rgba(16,185,129,0.1)' }}>
            <Landmark size={24} color={colors.warning} />
            <div>
              <h1 style={{ fontSize: typography.base }}>Kisan Sarthi</h1>
              <span>Agriculture Dept · Maharashtra</span>
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
            padding: '16px 20px', borderTop: `1px solid rgba(16,185,129,0.1)`,
            fontSize: typography.xs, color: colors.textDim, fontFamily: typography.fontFamily,
          }}>
            Govt. of Maharashtra · v2.0
          </div>
        </motion.aside>

        <main className="framer-main">
          <div className="framer-topbar">
            <h2 style={{ fontFamily: typography.fontFamily }}>{activeLabel}</h2>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: typography.xs, color: colors.textMuted, fontFamily: typography.fontFamily,
            }}>
              <Landmark size={14} />
              Agriculture Department
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

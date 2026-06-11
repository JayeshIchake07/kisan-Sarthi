import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography } from '../shared';
import { sidebarSlide } from '../shared/animations';
import {
  LayoutDashboard, FileText, Shield, Leaf, BarChart3, Building2
} from '../shared/icons';
import LoanPipeline from './LoanPipeline';
import ApplicantDetails from './ApplicantDetails';
import RiskAssessment from './RiskAssessment';
import CropHealthIntel from './CropHealthIntel';
import PortfolioAnalytics from './PortfolioAnalytics';

const NAV_ITEMS = [
  { id: 'pipeline', label: 'Loan Pipeline', icon: LayoutDashboard },
  { id: 'applicant', label: 'Applicant Details', icon: FileText },
  { id: 'risk', label: 'Risk Assessment', icon: Shield },
  { id: 'cropHealth', label: 'Crop Health Intel', icon: Leaf },
  { id: 'portfolio', label: 'Portfolio Analytics', icon: BarChart3 },
];

const SCREENS = {
  pipeline: LoanPipeline,
  applicant: ApplicantDetails,
  risk: RiskAssessment,
  cropHealth: CropHealthIntel,
  portfolio: PortfolioAnalytics,
};

/**
 * Bank dashboard shell with professional sidebar.
 */
export default function BankShell() {
  const [activeScreen, setActiveScreen] = useState('pipeline');
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
          style={{ background: '#070d11' }}
        >
          <div className="framer-sidebar-brand" style={{ borderBottomColor: 'rgba(59,130,246,0.15)' }}>
            <Building2 size={24} color={colors.info} />
            <div>
              <h1 style={{ fontSize: typography.base }}>Kisan Sarthi</h1>
              <span>Bank Portal · Crop Finance</span>
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
                style={activeScreen === id ? { borderLeftColor: colors.info, color: colors.info } : {}}
              >
                <Icon size={18} />
                {label}
              </motion.button>
            ))}
          </nav>

          <div style={{
            padding: '16px 20px', borderTop: `1px solid rgba(59,130,246,0.12)`,
            fontSize: typography.xs, color: colors.textDim, fontFamily: typography.fontFamily,
          }}>
            Agri Finance Division · v2.0
          </div>
        </motion.aside>

        <main className="framer-main">
          <div className="framer-topbar">
            <h2 style={{ fontFamily: typography.fontFamily }}>{activeLabel}</h2>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: typography.xs, color: colors.textMuted, fontFamily: typography.fontFamily,
            }}>
              <Building2 size={14} />
              Crop Loan Division
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

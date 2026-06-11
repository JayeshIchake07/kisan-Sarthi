import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { D } from '@/data/seedData';
import { CROPS, CROP_COLORS } from '@/data/crops';
import { DISTRICTS } from '@/data/districts';
import { useClimateAlerts } from '@/hooks/useClimateAlerts';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import MetricCard from '../shared/MetricCard';
import ChartCard from '../shared/ChartCard';
import { Users, Leaf, AlertTriangle, Target } from '../shared/icons';
import AdminDrawer from './AdminDrawer';

const AdminMap = lazy(() => import('./AdminMap'));

/**
 * Admin Command Center — real-time stats grid, interactive satellite centerpiece.
 */
export default function CommandCenter() {
  const { alerts } = useClimateAlerts();
  const [selectedFarm, setSelectedFarm] = useState(null);

  const stressData = [
    { name: 'Healthy', value: D.plots.filter(p => p.stress === 'healthy').length, color: colors.success },
    { name: 'Mild', value: D.plots.filter(p => p.stress === 'mild').length, color: colors.warning },
    { name: 'Severe', value: D.plots.filter(p => p.stress === 'severe').length, color: colors.danger },
  ];

  const cropData = CROPS.map(crop => ({
    crop,
    count: D.plots.filter(p => p.crop === crop).length,
    color: CROP_COLORS[crop],
  }));

  const districtData = DISTRICTS.map(d => {
    const plots = D.plots.filter(p => p.district === d.name);
    return {
      name: d.name,
      avgNdvi: plots.length ? +(plots.reduce((s, p) => s + p.ndvi, 0) / plots.length).toFixed(3) : 0,
      farmerCount: plots.length,
    };
  });

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon={Users} label="Total Farmers" value={D.plots.length} trend={8.2} color={colors.primary} />
        <MetricCard icon={Leaf} label="Avg NDVI" value={+(D.plots.reduce((s, p) => s + p.ndvi, 0) / D.plots.length).toFixed(2)} decimals={2} trend={3.1} color={colors.success} />
        <MetricCard icon={AlertTriangle} label="Active Alerts" value={alerts.length} color={colors.danger} />
        <MetricCard icon={Target} label="Healthy Fields" value={D.plots.filter(p => p.stress === 'healthy').length} suffix={`/${D.plots.length}`} color={colors.success} />
      </div>

      {/* Leaflet Admin Map centerpiece */}
      <motion.div variants={staggerItem} style={{ marginBottom: '1.5rem' }}>
        <div style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: typography.base, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily }}>
                Agricultural Command & Telemetry Console
              </h3>
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: '2px 0 0', fontFamily: typography.fontFamily }}>
                Real-time district clusters, live environmental risk zones, and field boundaries
              </p>
            </div>
          </div>
          
          <Suspense fallback={
            <div style={{
              height: '620px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: colors.bgLight, borderRadius: '12px', border: `1px solid ${colors.border}`,
              color: colors.textSecondary, fontSize: typography.xs, fontFamily: typography.fontFamily
            }}>
              Loading command console satellite overlay...
            </div>
          }>
            <AdminMap 
              selectedFarm={selectedFarm} 
              onSelectFarm={setSelectedFarm} 
              alerts={alerts}
              stressData={stressData}
              districtData={districtData}
            />
          </Suspense>
        </div>
      </motion.div>

      {/* Crop Distribution Bar Chart */}
      <motion.div variants={staggerItem}>
        <ChartCard title="Monitored Crop Varieties" subtitle="Total acreage distribution per crop type" height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cropData}>
              <XAxis dataKey="crop" tick={{ fontSize: 11, fill: colors.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: colors.bgCard, border: `1px solid ${colors.border}`,
                  borderRadius: '10px', fontFamily: typography.fontFamily,
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {cropData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Slide-in right drawer */}
      <AnimatePresence>
        {selectedFarm && (
          <AdminDrawer farm={selectedFarm} onClose={() => setSelectedFarm(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

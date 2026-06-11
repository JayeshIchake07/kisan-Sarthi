import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { D } from '@/data/seedData';
import { DISTRICTS } from '@/data/districts';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import DataTable from '../shared/DataTable';
import FilterBar from '../shared/FilterBar';
import StatusBadge from '../shared/StatusBadge';
import FramerCard from '../shared/FramerCard';
import FarmerManagementMap from './FarmerManagementMap';
import { Phone, Sprout, Activity, MapPin, Search } from '../shared/icons';

/**
 * Farmer Management — satellite tracking map, sortable farmer table, status filters.
 */
export default function FarmerManagement() {
  const [districtFilter, setDistrictFilter] = useState('all');
  const [stressFilter, setStressFilter] = useState('all');
  const [selectedPlot, setSelectedPlot] = useState(null);

  let filteredPlots = D.plots;
  if (districtFilter !== 'all') filteredPlots = filteredPlots.filter(p => p.district === districtFilter);
  if (stressFilter !== 'all') filteredPlots = filteredPlots.filter(p => p.stress === stressFilter);

  const columns = [
    { key: 'id', label: 'ID', align: 'center' },
    { key: 'farmer', label: 'Farmer', render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '8px',
          background: `${colors.primary}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: typography.xs, fontWeight: typography.bold,
          color: colors.primary, fontFamily: typography.fontFamily,
        }}>
          {row.initials}
        </div>
        <div>
          <div style={{ fontWeight: typography.medium, fontSize: typography.xs }}>{v}</div>
          <div style={{ fontSize: '10px', color: colors.textMuted }}>{row.phone}</div>
        </div>
      </div>
    )},
    { key: 'district', label: 'District' },
    { key: 'crop', label: 'Crop' },
    { key: 'acres', label: 'Acres', align: 'right' },
    { key: 'ndvi', label: 'NDVI', align: 'right', render: (v) => (
      <span style={{ color: v > 0.4 ? colors.success : v > 0.2 ? colors.warning : colors.danger, fontWeight: typography.semibold }}>
        {v.toFixed(3)}
      </span>
    )},
    { key: 'stress', label: 'Status', render: (v) => <StatusBadge status={v} size="sm" /> },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Interactive Satellite Map & Farmer Detail Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <motion.div variants={staggerItem}>
            <FramerCard>
              <h3 style={{
                fontSize: typography.sm, fontWeight: typography.semibold,
                color: colors.textPrimary, margin: '0 0 4px', fontFamily: typography.fontFamily
              }}>
                Satellite Tracking Map
              </h3>
              <p style={{
                fontSize: typography.xs, color: colors.textMuted, margin: '0 0 12px', fontFamily: typography.fontFamily
              }}>
                All member farms, fields, and health status indicators
              </p>
              
              <FarmerManagementMap
                plots={filteredPlots}
                selectedPlot={selectedPlot}
                onSelectPlot={setSelectedPlot}
              />
            </FramerCard>
          </motion.div>

          {/* Farmer Detail Card */}
          <motion.div variants={staggerItem}>
            <AnimatePresence mode="wait">
              {selectedPlot ? (
                <motion.div
                  key={selectedPlot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <FramerCard style={{ borderLeft: `4px solid ${selectedPlot.stress === 'healthy' ? colors.success : selectedPlot.stress === 'mild' ? colors.warning : colors.danger}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '8px',
                          background: `${colors.primary}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: typography.sm, fontWeight: typography.bold,
                          color: colors.primary,
                        }}>
                          {selectedPlot.initials}
                        </div>
                        <div>
                          <h4 style={{ fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0 }}>
                            {selectedPlot.farmer}
                          </h4>
                          <p style={{ fontSize: '10px', color: colors.textMuted, margin: '2px 0 0' }}>
                            ID: KS-2026-0{selectedPlot.id}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={selectedPlot.stress} size="sm" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      {[
                        { label: 'Crop', value: selectedPlot.crop, icon: Sprout, color: colors.primaryLight },
                        { label: 'Acreage', value: `${selectedPlot.acres} ac`, icon: Activity, color: colors.success },
                        { label: 'District', value: selectedPlot.district, icon: MapPin, color: colors.warning },
                        { label: 'Phone', value: selectedPlot.phone, icon: Phone, color: colors.info }
                      ].map((item, i) => (
                        <div key={i} style={{
                          background: colors.bgLighter,
                          border: `1px solid ${colors.borderLight}`,
                          borderRadius: '8px',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <item.icon size={13} color={item.color} />
                          <div>
                            <span style={{ fontSize: '8px', color: colors.textMuted, display: 'block' }}>{item.label}</span>
                            <span style={{ fontSize: '10px', fontWeight: typography.semibold, color: colors.textPrimary }}>{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: colors.bgLighter, borderRadius: '8px', padding: '10px', border: `1px solid ${colors.borderLight}` }}>
                      <div>
                        <span style={{ fontSize: '8px', color: colors.textMuted, display: 'block' }}>NDVI index</span>
                        <span style={{
                          fontSize: typography.sm,
                          fontWeight: typography.bold,
                          color: selectedPlot.ndvi > 0.4 ? colors.success : selectedPlot.ndvi > 0.2 ? colors.warning : colors.danger
                        }}>
                          {selectedPlot.ndvi.toFixed(3)}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '8px', color: colors.textMuted, display: 'block' }}>Risk index</span>
                        <span style={{
                          fontSize: typography.sm,
                          fontWeight: typography.bold,
                          color: selectedPlot.riskScore > 65 ? colors.danger : selectedPlot.riskScore > 35 ? colors.warning : colors.success
                        }}>
                          {selectedPlot.riskScore}/100
                        </span>
                      </div>
                    </div>
                  </FramerCard>
                </motion.div>
              ) : (
                <FramerCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', borderDashArray: '4', borderStyle: 'dashed', borderColor: colors.border }}>
                  <div style={{ textAlign: 'center', color: colors.textMuted, fontFamily: typography.fontFamily, fontSize: typography.xs }}>
                    <Search size={18} style={{ marginBottom: '6px', color: colors.textDim }} />
                    <p style={{ margin: 0 }}>Click a map marker or polygon boundary to view farmer details</p>
                  </div>
                </FramerCard>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Column: Filters & Table */}
        <div>
          {/* Filters */}
          <motion.div variants={staggerItem} style={{ marginBottom: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <FilterBar
              label="District"
              filters={[{ value: 'all', label: 'All' }, ...DISTRICTS.map(d => d.name)]}
              activeFilter={districtFilter}
              onFilterChange={(val) => {
                setDistrictFilter(val);
                setSelectedPlot(null);
              }}
            />
            <FilterBar
              label="Status"
              filters={[
                { value: 'all', label: 'All' },
                { value: 'healthy', label: 'Healthy' },
                { value: 'mild', label: 'Mild' },
                { value: 'severe', label: 'Severe' },
              ]}
              activeFilter={stressFilter}
              onFilterChange={(val) => {
                setStressFilter(val);
                setSelectedPlot(null);
              }}
            />
          </motion.div>

          {/* Summary */}
          <motion.div variants={staggerItem} style={{
            display: 'flex', gap: '12px', marginBottom: '1rem',
            fontSize: typography.sm, fontFamily: typography.fontFamily,
          }}>
            <span style={{ color: colors.textMuted }}>
              Showing <strong style={{ color: colors.textPrimary }}>{filteredPlots.length}</strong> farmers
            </span>
          </motion.div>

          {/* Table */}
          <motion.div variants={staggerItem}>
            <DataTable 
              columns={columns} 
              data={filteredPlots} 
              maxHeight="600px" 
              onRowClick={(row) => setSelectedPlot(row)} 
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

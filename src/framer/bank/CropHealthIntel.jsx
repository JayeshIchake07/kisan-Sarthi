import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { D } from '@/data/seedData';
import { CROPS, CROP_COLORS } from '@/data/crops';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import ChartCard from '../shared/ChartCard';
import FilterBar from '../shared/FilterBar';
import StatusBadge from '../shared/StatusBadge';
import { Leaf, Satellite, Target } from '../shared/icons';

/**
 * Crop Health Intelligence — satellite evidence, NDVI comparison, seasonal patterns.
 */
export default function CropHealthIntel() {
  const [selectedCrop, setSelectedCrop] = useState('all');

  const filteredPlots = selectedCrop === 'all'
    ? D.plots
    : D.plots.filter(p => p.crop === selectedCrop);

  const avgNdvi = filteredPlots.length
    ? +(filteredPlots.reduce((s, p) => s + p.ndvi, 0) / filteredPlots.length).toFixed(3) : 0;

  // Average NDVI history across filtered plots
  const avgHistory = [];
  if (filteredPlots.length > 0) {
    const sampleHist = D.hist[filteredPlots[0].id];
    for (let i = 0; i < sampleHist.length; i++) {
      const avg = filteredPlots.reduce((s, p) => {
        const h = D.hist[p.id];
        return s + (h[i]?.ndvi || 0);
      }, 0) / filteredPlots.length;
      avgHistory.push({ label: `D-${sampleHist[i].day}`, ndvi: +avg.toFixed(3) });
    }
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Filter */}
      <motion.div variants={staggerItem} style={{ marginBottom: '1rem' }}>
        <FilterBar
          label="Crop"
          filters={[{ value: 'all', label: 'All Crops' }, ...CROPS]}
          activeFilter={selectedCrop}
          onFilterChange={setSelectedCrop}
        />
      </motion.div>

      {/* Summary */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <FramerCard glowing>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Leaf size={24} color={avgNdvi > 0.4 ? colors.success : colors.warning} />
            <div>
              <p style={{
                fontSize: typography['2xl'], fontWeight: typography.bold,
                color: avgNdvi > 0.4 ? colors.success : colors.warning,
                margin: 0, fontFamily: typography.fontFamily,
              }}>
                {avgNdvi}
              </p>
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
                Average NDVI
              </p>
            </div>
          </div>
        </FramerCard>
        <FramerCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Satellite size={24} color={colors.info} />
            <div>
              <p style={{
                fontSize: typography['2xl'], fontWeight: typography.bold,
                color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily,
              }}>
                {filteredPlots.length}
              </p>
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
                Fields Monitored
              </p>
            </div>
          </div>
        </FramerCard>
        <FramerCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Target size={24} color={colors.success} />
            <div>
              <p style={{
                fontSize: typography['2xl'], fontWeight: typography.bold,
                color: colors.success, margin: 0, fontFamily: typography.fontFamily,
              }}>
                {Math.round(filteredPlots.filter(p => p.stress === 'healthy').length / filteredPlots.length * 100)}%
              </p>
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
                Healthy Fields
              </p>
            </div>
          </div>
        </FramerCard>
      </div>

      {/* NDVI Trend Chart */}
      <ChartCard
        title="Average NDVI Trend"
        subtitle={`${selectedCrop === 'all' ? 'All crops' : selectedCrop} · ${filteredPlots.length} fields`}
        height={250}
        style={{ marginBottom: '1.5rem' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={avgHistory}>
            <defs>
              <linearGradient id="cropNdviGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.success} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.success} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: colors.textDim }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: colors.textDim }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
            <Area type="monotone" dataKey="ndvi" stroke={colors.success} strokeWidth={2} fill="url(#cropNdviGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Field Status List */}
      <FramerCard>
        <h3 style={{
          fontSize: typography.base, fontWeight: typography.semibold,
          color: colors.textPrimary, margin: '0 0 14px', fontFamily: typography.fontFamily,
        }}>
          Satellite Evidence
        </h3>
        {filteredPlots.slice(0, 10).map((plot, i) => (
          <motion.div
            key={plot.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0',
              borderBottom: i < 9 ? `1px solid ${colors.borderLight}` : 'none',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '8px',
              background: `${colors.primary}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: typography.xs, fontWeight: typography.bold,
              color: colors.primary, fontFamily: typography.fontFamily,
            }}>
              {plot.initials}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: typography.sm, color: colors.textPrimary, fontFamily: typography.fontFamily }}>
                {plot.farmer}
              </span>
              <span style={{ fontSize: typography.xs, color: colors.textMuted, marginLeft: '8px', fontFamily: typography.fontFamily }}>
                {plot.crop} · {plot.acres}ac · {plot.district}
              </span>
            </div>
            <span style={{
              fontSize: typography.sm, fontWeight: typography.semibold,
              color: plot.ndvi > 0.4 ? colors.success : plot.ndvi > 0.2 ? colors.warning : colors.danger,
              fontFamily: typography.fontFamily,
            }}>
              {plot.ndvi.toFixed(3)}
            </span>
            <StatusBadge status={plot.stress} size="sm" />
          </motion.div>
        ))}
      </FramerCard>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGovernmentData } from '@/hooks/useGovernmentData';
import { CROPS } from '@/data/crops';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import DataTable from '../shared/DataTable';
import FilterBar from '../shared/FilterBar';
import ChartCard from '../shared/ChartCard';
import StatusBadge from '../shared/StatusBadge';

/**
 * District Analytics — district ranking chart, comparison table, crop filters.
 */
export default function DistrictAnalytics() {
  const [cropFilter, setCropFilter] = useState('all');
  const { districtRankings, cropDistribution } = useGovernmentData(
    cropFilter !== 'all' ? { crop: cropFilter } : {}
  );

  const columns = [
    { key: 'rank', label: '#', align: 'center' },
    { key: 'district', label: 'District', render: (v) => (
      <span style={{ fontWeight: typography.semibold }}>{v}</span>
    )},
    { key: 'farmerCount', label: 'Farmers', align: 'right' },
    { key: 'hectares', label: 'Hectares', align: 'right', render: (v) => v.toLocaleString('en-IN') },
    { key: 'avgNdvi', label: 'Avg NDVI', align: 'right', render: (v) => (
      <span style={{
        color: v > 0.5 ? colors.success : v > 0.3 ? colors.warning : colors.danger,
        fontWeight: typography.semibold,
      }}>
        {v.toFixed(3)}
      </span>
    )},
    { key: 'cropHealth', label: 'Health', render: (v) => <StatusBadge status={v} size="sm" /> },
    { key: 'subsidyUtilization', label: 'Subsidy %', align: 'right', render: (v) => `${v}%` },
    { key: 'irrigationType', label: 'Irrigation' },
  ];

  const rankingChartData = districtRankings
    .sort((a, b) => b.avgNdvi - a.avgNdvi)
    .map(d => ({
      district: d.district,
      ndvi: d.avgNdvi,
    }));

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Filters */}
      <motion.div variants={staggerItem} style={{ marginBottom: '1rem' }}>
        <FilterBar
          label="Filter by Crop"
          filters={[{ value: 'all', label: 'All Crops' }, ...CROPS]}
          activeFilter={cropFilter}
          onFilterChange={setCropFilter}
        />
      </motion.div>

      {/* Ranking Chart — full width */}
      <motion.div variants={staggerItem} style={{ marginBottom: '1.5rem' }}>
        <ChartCard
          title="District Ranking by NDVI"
          subtitle="Higher NDVI = healthier crops across all monitored fields"
          height={280}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rankingChartData}>
              <XAxis dataKey="district" tick={{ fontSize: 11, fill: colors.textMuted }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
              <Bar dataKey="ndvi" radius={[6, 6, 0, 0]}>
                {rankingChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.ndvi > 0.5 ? colors.success : entry.ndvi > 0.3 ? colors.warning : colors.danger} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Crop Production Chart */}
      <motion.div variants={staggerItem} style={{ marginBottom: '1.5rem' }}>
        <ChartCard
          title="Crop Production Summary"
          subtitle="State-wide crop area and production"
          height={200}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cropDistribution}>
              <XAxis dataKey="crop" tick={{ fontSize: 11, fill: colors.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
              <Bar dataKey="area" name="Area (ha)" fill={colors.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* District Table */}
      <motion.div variants={staggerItem}>
        <DataTable columns={columns} data={districtRankings} maxHeight="500px" />
      </motion.div>
    </motion.div>
  );
}

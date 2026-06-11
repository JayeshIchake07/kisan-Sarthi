import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import { D } from '@/data/seedData';
import { CROPS, CROP_COLORS } from '@/data/crops';
import { DISTRICTS } from '@/data/districts';
import { FPO_NAMES } from '@/data/fpos';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import MetricCard from '../shared/MetricCard';
import ChartCard from '../shared/ChartCard';
import { Users, Sprout, TrendingUp, Target, Globe } from '../shared/icons';

/**
 * FPO Analytics — crop distribution, member metrics, performance trends, and coverage thumbnail.
 */
export default function FPOAnalytics() {
  const cropDistribution = CROPS.map(crop => ({
    name: crop,
    value: D.plots.filter(p => p.crop === crop).length,
    color: CROP_COLORS[crop],
  }));

  const fpoData = FPO_NAMES.map((name, i) => {
    const members = D.plots.filter(p => p.fpoId === i + 1);
    const avgNdvi = members.length
      ? +(members.reduce((s, p) => s + p.ndvi, 0) / members.length).toFixed(3) : 0;
    return {
      name: name.replace(' FPO', ''),
      members: members.length,
      avgNdvi,
      healthyPct: members.length
        ? Math.round(members.filter(p => p.stress === 'healthy').length / members.length * 100) : 0,
    };
  });

  const monthlyPerformance = [
    { month: 'Jan', ndvi: 0.38, members: 14 },
    { month: 'Feb', ndvi: 0.42, members: 15 },
    { month: 'Mar', ndvi: 0.48, members: 17 },
    { month: 'Apr', ndvi: 0.55, members: 18 },
    { month: 'May', ndvi: 0.51, members: 19 },
    { month: 'Jun', ndvi: 0.52, members: 20 },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Top Metrics */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon={Users} label="Total Members" value={D.plots.length} trend={12} color={colors.primary} />
        <MetricCard icon={Sprout} label="Crops Tracked" value={CROPS.length} color={colors.success} />
        <MetricCard icon={Target} label="Healthy Rate" value={Math.round(D.plots.filter(p => p.stress === 'healthy').length / D.plots.length * 100)} suffix="%" trend={5.2} color={colors.success} />
        <MetricCard icon={TrendingUp} label="Avg NDVI" value={+(D.plots.reduce((s, p) => s + p.ndvi, 0) / D.plots.length).toFixed(2)} decimals={2} trend={3.8} color={colors.primary} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Crop Distribution Pie */}
        <ChartCard title="Crop Distribution" subtitle="Fields by crop type" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={cropDistribution} cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3} dataKey="value">
                {cropDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', position: 'absolute', bottom: '12px', left: 0, right: 0 }}>
            {cropDistribution.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: typography.xs, color: colors.textSecondary, fontFamily: typography.fontFamily }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Performance Trend */}
        <ChartCard title="Monthly Performance" subtitle="NDVI trend & member growth" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyPerformance}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
              <Line type="monotone" dataKey="ndvi" stroke={colors.success} strokeWidth={2} dot={{ fill: colors.success, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Split Bottom Row: Charts & Small Map Thumbnail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
        
        {/* FPO-wise Performance */}
        <motion.div variants={staggerItem}>
          <ChartCard title="FPO Performance Comparison" subtitle="Members and crop health by FPO" height={220}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fpoData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: colors.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: colors.textDim }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: typography.fontFamily }} />
                <Bar dataKey="healthyPct" name="Healthy %" fill={colors.success} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Small Map Thumbnail Card */}
        <motion.div variants={staggerItem}>
          <div style={{
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            borderRadius: '16px',
            padding: '16px',
            height: '252px', // matches the chartcard height + header gaps
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            position: 'relative'
          }}>
            <div>
              <h3 style={{ fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0, fontFamily: typography.fontFamily }}>
                Regional Footprint
              </h3>
              <p style={{ fontSize: '10px', color: colors.textMuted, margin: '2px 0 0', fontFamily: typography.fontFamily }}>
                Interactive spatial coverage preview
              </p>
            </div>

            {/* Read-Only Mini Map Container */}
            <div style={{
              flex: 1,
              borderRadius: '10px',
              overflow: 'hidden',
              border: `1px solid ${colors.borderLight}`,
              position: 'relative'
            }}>
              <MapContainer
                center={[19.6, 76.0]}
                zoom={5.2}
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                style={{ width: '100%', height: '100%', zIndex: 0 }}
              >
                <TileLayer
                  attribution='&copy; Esri'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                {/* District Coverage dots */}
                {DISTRICTS.map(d => (
                  <Circle
                    key={d.name}
                    center={[d.lat, d.lon]}
                    radius={15000}
                    pathOptions={{ color: colors.primary, fillColor: colors.primary, fillOpacity: 0.5, weight: 1 }}
                  />
                ))}
              </MapContainer>

              {/* Spatial Metrics Glass Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                right: '8px',
                background: 'rgba(10, 24, 16, 0.85)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${colors.glassBorder}`,
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10
              }}>
                <Globe size={14} color={colors.primaryLight} />
                <span style={{ fontSize: '9px', color: colors.textSecondary, fontFamily: typography.fontFamily, fontWeight: 500 }}>
                  Active in 5 Maharashtra districts
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

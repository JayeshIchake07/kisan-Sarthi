import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Polygon, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { D } from '@/data/seedData';
import { useAdvisory } from '@/hooks/useAdvisory';
import { useLanguage } from '@/hooks/useLanguage';
import { colors, typography } from '../shared';
import FramerCard from '../shared/FramerCard';
import StatusBadge from '../shared/StatusBadge';
import {
  Satellite, Layers, Sun, CloudRain, Droplets,
  RefreshCw, Zap, X, MapPin, Activity, AlertTriangle
} from '../shared/icons';

// GPS pulse keyframes injected once
if (typeof document !== 'undefined' && !document.getElementById('gps-pulse-style')) {
  const style = document.createElement('style');
  style.id = 'gps-pulse-style';
  style.innerHTML = `
    @keyframes gps-pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// GPS-pulsing farmer location marker (blue dot)
const farmerLocationIcon = L.divIcon({
  className: 'custom-gps-icon',
  html: `
    <div style="
      width: 18px;
      height: 18px;
      background: #3b82f6;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 14px rgba(59, 130, 246, 0.9);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -7px; left: -7px; right: -7px; bottom: -7px;
        border: 2px solid #3b82f6;
        border-radius: 50%;
        animation: gps-pulse 2s infinite ease-out;
        pointer-events: none;
      "></div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Dynamic map view controller
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function FieldHealthMap({ t }) {
  const { lang } = useLanguage();
  // The current logged-in farmer — only their farm is shown
  const farm = D.plots[0]; // Ramesh Patil, Nashik

  const [mapLayer, setMapLayer] = useState('satellite'); // 'satellite' | 'standard' | 'ndvi'
  const [activeOverlay, setActiveOverlay] = useState(null); // 'heatwave' | 'rain' | 'drought'
  const [isSyncing, setIsSyncing] = useState(false);
  const [telemetryMsg, setTelemetryMsg] = useState('Sentinel-2 L2A · Sync up-to-date');
  const [showDetail, setShowDetail] = useState(true);

  const { advisory, loading: advisoryLoading, generate: getAdvisory, reset: resetAdvisory } = useAdvisory();

  const mapCenter = [farm.lat, farm.lon];
  const ndviTrend = useMemo(() => D.hist[farm.id] || [], [farm.id]);

  const farmColor = farm.stress === 'healthy' ? colors.success
    : farm.stress === 'mild' ? colors.warning
    : colors.danger;

  const handleSync = () => {
    setIsSyncing(true);
    setTelemetryMsg('Connecting to Sentinel Hub API...');
    setTimeout(() => {
      setTelemetryMsg('Fetching L2A bands (B4, B8)...');
      setTimeout(() => {
        setTelemetryMsg('Recalculating NDVI indices...');
        setTimeout(() => {
          setIsSyncing(false);
          setTelemetryMsg('Sync complete · Tile ID T43QED');
        }, 800);
      }, 1000);
    }, 1000);
  };

  // Prevent overlay panel events from leaking into the map
  const stopProp = {
    onMouseDown: (e) => e.stopPropagation(),
    onClick: (e) => e.stopPropagation(),
    onWheel: (e) => e.stopPropagation(),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{
            fontSize: typography.lg, fontWeight: typography.bold,
            color: colors.textPrimary, margin: '0 0 2px', fontFamily: typography.fontFamily,
          }}>
            {t('myFieldMap')}
          </h2>
          <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
            {t('satelliteSyncBanner')} · {farm.district} District
          </p>
        </div>
        <StatusBadge status={farm.stress} size="sm" pulsing={farm.stress === 'severe'} />
      </div>

      {/* Satellite Sync Banner */}
      <motion.div
        animate={{ borderLeftColor: isSyncing ? colors.warning : colors.primary }}
        style={{
          background: `${colors.primary}0a`,
          border: `1px solid ${colors.border}`,
          borderLeft: `4px solid ${colors.primary}`,
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: typography.fontFamily,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isSyncing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw size={13} color={colors.warning} />
            </motion.div>
          ) : (
            <Satellite size={13} color={colors.primaryLight} />
          )}
          <span style={{ fontSize: typography.xs, color: isSyncing ? colors.warning : colors.textSecondary }}>
            {telemetryMsg}
          </span>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          style={{
            background: 'none', border: 'none', cursor: isSyncing ? 'not-allowed' : 'pointer',
            color: colors.primaryLight, fontSize: typography.xs, fontWeight: typography.semibold,
            display: 'flex', alignItems: 'center', gap: '4px', fontFamily: typography.fontFamily,
          }}
        >
          {!isSyncing && <RefreshCw size={11} />}
          {t('sync')}
        </button>
      </motion.div>

      {/* Map Container */}
      <div style={{
        position: 'relative',
        height: '400px',
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
        background: '#040d06',
        flexShrink: 0,
      }}>

        {/* ── TOP-LEFT: Field Stats Glass Panel ── */}
        <div {...stopProp} style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 1000,
          background: colors.glass, backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.glassBorder}`,
          borderRadius: '12px', padding: '10px 12px',
          display: 'flex', flexDirection: 'column', gap: '6px',
          fontFamily: typography.fontFamily,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          minWidth: '160px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '4px' }}>
            <MapPin size={11} color={colors.primaryLight} />
            <span style={{ fontSize: '9px', fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {farm.farmer}'s Farm
            </span>
          </div>
          {[
            { label: 'Crop', value: farm.crop },
            { label: 'Area', value: `${farm.acres} ac` },
            { label: 'District', value: farm.district },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
              <span style={{ color: colors.textMuted }}>{item.label}</span>
              <span style={{ color: colors.textPrimary, fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* ── TOP-RIGHT: Layer + Climate Controls ── */}
        <div {...stopProp} style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 1000,
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {/* Layer Switcher */}
          <div style={{
            background: colors.glass, backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.glassBorder}`,
            borderRadius: '12px', padding: '4px',
            display: 'flex', gap: '2px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {[
              { id: 'satellite', icon: Satellite, label: 'Sat' },
              { id: 'standard', icon: Layers, label: 'Map' },
              { id: 'ndvi', icon: Activity, label: 'NDVI' },
            ].map(l => (
              <button
                key={l.id}
                onClick={() => setMapLayer(l.id)}
                style={{
                  background: mapLayer === l.id ? colors.primary : 'transparent',
                  border: 'none', borderRadius: '8px',
                  color: mapLayer === l.id ? '#fff' : colors.textMuted,
                  padding: '6px 8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: typography.xs, fontFamily: typography.fontFamily,
                  transition: 'background 0.2s',
                }}
              >
                <l.icon size={11} />
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          {/* Climate Overlay Toggles */}
          <div style={{
            background: colors.glass, backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.glassBorder}`,
            borderRadius: '12px', padding: '8px',
            display: 'flex', flexDirection: 'column', gap: '4px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <span style={{ fontSize: '9px', color: colors.textMuted, textAlign: 'center', textTransform: 'uppercase', fontWeight: 700 }}>
              {t('riskOverlays')}
            </span>
            {[
              { id: 'heatwave', icon: Sun, labelKey: 'heatwave', color: '#f59e0b' },
              { id: 'rain', icon: CloudRain, labelKey: 'rainAlert', color: '#3b82f6' },
              { id: 'drought', icon: Droplets, labelKey: 'drought', color: '#d97706' },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setActiveOverlay(activeOverlay === c.id ? null : c.id)}
                style={{
                  background: activeOverlay === c.id ? `${c.color}22` : 'transparent',
                  border: `1px solid ${activeOverlay === c.id ? c.color : 'transparent'}`,
                  borderRadius: '6px', color: activeOverlay === c.id ? c.color : colors.textSecondary,
                  padding: '5px 8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '10px', fontFamily: typography.fontFamily, textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <c.icon size={10} color={c.color} />
                <span>{t(c.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── BOTTOM-LEFT: NDVI Legend ── */}
        <div {...stopProp} style={{
          position: 'absolute', bottom: '12px', left: '12px', zIndex: 1000,
          background: colors.glass, backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.glassBorder}`,
          borderRadius: '10px', padding: '8px 10px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          fontFamily: typography.fontFamily,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize: '9px', color: colors.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>{t('ndviLegend')}</span>
          {[
            { labelKey: 'ndviHealthy', color: colors.success },
            { labelKey: 'ndviModerate', color: colors.warning },
            { labelKey: 'ndviSevere', color: colors.danger },
          ].map(item => (
            <div key={item.labelKey} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: '10px', color: colors.textSecondary }}>{t(item.labelKey)}</span>
            </div>
          ))}
        </div>

        {/* ── BOTTOM-RIGHT: Live NDVI & Risk readout ── */}
        <div {...stopProp} style={{
          position: 'absolute', bottom: '12px', right: '12px', zIndex: 1000,
          background: colors.glass, backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.glassBorder}`,
          borderRadius: '10px', padding: '8px 12px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          fontFamily: typography.fontFamily, minWidth: '130px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize: '9px', color: colors.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>{t('liveIndices')}</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span style={{ color: colors.textMuted }}>NDVI</span>
            <span style={{
              fontWeight: 700,
              color: farm.ndvi > 0.4 ? colors.success : farm.ndvi > 0.2 ? colors.warning : colors.danger
            }}>{farm.ndvi}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span style={{ color: colors.textMuted }}>NDWI</span>
            <span style={{ fontWeight: 700, color: farm.ndwi > 0.1 ? colors.success : colors.danger }}>{farm.ndwi}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span style={{ color: colors.textMuted }}>{t('riskIndex')}</span>
            <span style={{
              fontWeight: 700,
              color: farm.riskScore > 65 ? colors.danger : farm.riskScore > 35 ? colors.warning : colors.success
            }}>{farm.riskScore}/100</span>
          </div>
        </div>

        {/* ── LEAFLET MAP ── */}
        <MapContainer
          center={mapCenter}
          zoom={14}
          zoomControl={false}
          style={{ width: '100%', height: '100%', zIndex: 0 }}
        >
          <MapController center={mapCenter} zoom={14} />

          {/* Base Tile Layer */}
          {(mapLayer === 'satellite' || mapLayer === 'ndvi') ? (
            <TileLayer
              attribution='&copy; Esri World Imagery'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          ) : (
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {/* ── THIS FARMER'S FIELD BOUNDARY POLYGON ONLY ── */}
          {farm.boundaryPolygon && (
            <Polygon
              positions={farm.boundaryPolygon}
              pathOptions={{
                color: '#ffffff',
                fillColor: farmColor,
                fillOpacity: mapLayer === 'ndvi' ? 0.65 : 0.3,
                weight: 2.5,
              }}
            />
          )}

          {/* ── GPS LOCATION MARKER ── */}
          <Marker position={mapCenter} icon={farmerLocationIcon} />

          {/* ── CLIMATE OVERLAYS ── */}
          {activeOverlay === 'heatwave' && (
            <Circle
              center={[farm.lat + 0.006, farm.lon - 0.005]}
              radius={1600}
              pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.18, weight: 2, dashArray: '6, 6' }}
            />
          )}
          {activeOverlay === 'rain' && (
            <Circle
              center={[farm.lat - 0.007, farm.lon + 0.008]}
              radius={2000}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.18, weight: 2 }}
            />
          )}
          {activeOverlay === 'drought' && (
            <Circle
              center={[farm.lat + 0.003, farm.lon + 0.006]}
              radius={1800}
              pathOptions={{ color: '#d97706', fillColor: '#d97706', fillOpacity: 0.18, weight: 2, dashArray: '4, 4' }}
            />
          )}
        </MapContainer>
      </div>

      {/* ── FARM DETAIL PANEL ── */}
      <FramerCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '10px',
              background: `${farmColor}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={20} color={farmColor} />
            </div>
            <div>
              <h3 style={{ fontSize: typography.base, fontWeight: typography.semibold, color: colors.textPrimary, margin: 0 }}>
                {farm.farmer}
              </h3>
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: '2px 0 0' }}>
                Plot KS-2026-0{farm.id} · {farm.crop} · {farm.acres} Acres
              </p>
            </div>
          </div>
          <StatusBadge status={farm.stress} size="sm" pulsing={farm.stress === 'severe'} />
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
          {[
            { label: t('ndviScore'), value: farm.ndvi, color: farm.ndvi > 0.4 ? colors.success : farm.ndvi > 0.2 ? colors.warning : colors.danger },
            { label: t('waterIndex'), value: `${farm.ndwi} (${farm.ndwi > 0.1 ? t('good') : t('dry')})`, color: farm.ndwi > 0.1 ? colors.success : colors.danger },
            { label: t('riskIndex'), value: `${farm.riskScore}/100`, color: farm.riskScore > 65 ? colors.danger : farm.riskScore > 35 ? colors.warning : colors.success },
          ].map(m => (
            <div key={m.label} style={{
              background: colors.bgLight, borderRadius: '10px', padding: '10px',
              textAlign: 'center', border: `1px solid ${colors.borderLight}`,
            }}>
              <span style={{ fontSize: '10px', color: colors.textMuted, display: 'block' }}>{m.label}</span>
              <span style={{ fontSize: typography.sm, fontWeight: typography.bold, color: m.color }}>
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* NDVI Trend */}
        <div style={{ height: '70px', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', color: colors.textMuted, display: 'block', marginBottom: '4px' }}>
            {t('ndviTrendDays')}
          </span>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ndviTrend}>
              <defs>
                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primaryLight} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors.primaryLight} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="ndvi" stroke={colors.primaryLight} strokeWidth={2} fill="url(#ndviGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Advisory */}
        <button
          onClick={() => getAdvisory(farm, lang)}
          disabled={advisoryLoading}
          style={{
            width: '100%', padding: '10px', borderRadius: '8px',
            background: advisoryLoading ? colors.bgLighter : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            border: 'none', cursor: advisoryLoading ? 'not-allowed' : 'pointer',
            color: '#ffffff', fontSize: typography.xs, fontWeight: typography.bold,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontFamily: typography.fontFamily,
          }}
        >
          {advisoryLoading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <RefreshCw size={12} />
              </motion.div>
              {t('analysingField')}
            </>
          ) : (
            <>
              <Zap size={12} />
              {t('getAiAdvisory')}
            </>
          )}
        </button>

        <AnimatePresence>
          {advisory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: '10px',
                background: colors.bgLight, border: `1px solid ${colors.border}`,
                borderRadius: '8px', padding: '10px', fontSize: '11px',
                color: colors.textSecondary, lineHeight: 1.5,
              }}
            >
              {advisory}
            </motion.div>
          )}
        </AnimatePresence>
      </FramerCard>
    </div>
  );
}

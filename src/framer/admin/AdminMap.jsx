import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { D } from '@/data/seedData';
import { DISTRICTS, DISTRICT_BOUNDS } from '@/data/districts';
import { colors, typography } from '../shared';
import { Layers, Activity, Sun, Bug, Navigation, AlertTriangle, Users } from '../shared/icons';

// Dynamic stylings for cluster icons
const createClusterIcon = (name, counts, highestStress) => {
  const color = highestStress === 'severe' ? colors.danger : highestStress === 'mild' ? colors.warning : colors.success;
  return L.divIcon({
    className: 'district-cluster-icon',
    html: `
      <div style="
        width: 50px;
        height: 50px;
        background: ${color}22;
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: ${colors.textPrimary};
        font-family: 'Inter', sans-serif;
        box-shadow: 0 0 16px ${color}55;
        cursor: pointer;
      ">
        <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; line-height: 1; color: ${colors.textSecondary}">${name.slice(0,3)}</span>
        <span style="font-size: 13px; font-weight: 800; margin-top: 1px;">${counts.total}</span>
        ${counts.severe > 0 ? `<span style="font-size: 8px; color: #ef4444; font-weight: 600; line-height: 1;">${counts.severe}⚠</span>` : ''}
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });
};

// Farm pins SVG markers
const createFarmPinIcon = (color, isSelected) => L.divIcon({
  className: 'farm-pin-icon',
  html: `
    <div style="
      width: ${isSelected ? '16px' : '12px'};
      height: ${isSelected ? '16px' : '12px'};
      background: ${color};
      border: 2px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)'};
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.6);
      transition: width 0.2s, height 0.2s;
    "></div>
  `,
  iconSize: [isSelected ? 16 : 12, isSelected ? 16 : 12],
  iconAnchor: [isSelected ? 8 : 6, isSelected ? 8 : 6]
});

// Map zoom listener component
function ZoomWatcher({ onZoomChange }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    }
  });
  return null;
}

// Map command action component
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function AdminMap({ selectedFarm, onSelectFarm, alerts = [], stressData = [], districtData = [] }) {
  const [zoom, setZoom] = useState(7);
  const [center, setCenter] = useState([19.50, 76.00]); // center of Maharashtra
  const [mapZoom, setMapZoom] = useState(7);
  
  // Layer toggles
  const [showFarms, setShowFarms] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showClimateRisk, setShowClimateRisk] = useState(true);
  const [showPestRisk, setShowPestRisk] = useState(true);

  // Group farms by district to build clusters
  const districtClusters = useMemo(() => {
    return DISTRICTS.map(d => {
      const plots = D.plots.filter(p => p.district === d.name);
      const severe = plots.filter(p => p.stress === 'severe').length;
      const mild = plots.filter(p => p.stress === 'mild').length;
      const healthy = plots.filter(p => p.stress === 'healthy').length;
      
      let highestStress = 'healthy';
      if (severe > 0) highestStress = 'severe';
      else if (mild > 0) highestStress = 'mild';

      return {
        ...d,
        highestStress,
        counts: {
          total: plots.length,
          severe,
          mild,
          healthy
        }
      };
    });
  }, []);

  const handleClusterClick = (d) => {
    setCenter([d.lat, d.lon]);
    setZoom(12);
    setMapZoom(12);
  };

  const getFarmColor = (farm) => {
    if (farm.stress === 'severe') return colors.danger;
    if (farm.stress === 'mild') return colors.warning;
    return colors.success;
  };

  // Helper to prevent map drags/clicks from leaking to overlays
  const stopPropagation = {
    onMouseDown: (e) => e.stopPropagation(),
    onClick: (e) => e.stopPropagation(),
    onWheel: (e) => e.stopPropagation(),
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '620px', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${colors.border}` }}>
      
      {/* 1. Top-Left Overlay: Live Climate Alerts */}
      {alerts.length > 0 && (
        <div 
          {...stopPropagation}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 1000,
            background: 'rgba(239, 68, 68, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontFamily: typography.fontFamily,
            maxWidth: '300px',
            maxHeight: '180px',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '4px' }}>
            <AlertTriangle size={14} color={colors.danger} />
            <span style={{ fontSize: '10px', fontWeight: typography.bold, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live Operations Alerts ({alerts.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {alerts.slice(0, 3).map((a, i) => (
              <div key={i} style={{ fontSize: '10px', color: '#fecaca', lineHeight: 1.3 }}>
                <strong>{a.district}</strong>: {a.type} ({a.farms} farms affected)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Top-Right Overlay: Interactive Map Layers */}
      <div 
        {...stopPropagation}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          background: colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.glassBorder}`,
          borderRadius: '12px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: typography.fontFamily,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '4px' }}>
          <Layers size={13} color={colors.primaryLight} />
          <span style={{ fontSize: '10px', fontWeight: typography.bold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Telemetry Controls
          </span>
        </div>

        {[
          { id: 'farms', label: 'Farm Locations', value: showFarms, onChange: setShowFarms, icon: Navigation, color: colors.success },
          { id: 'heatmap', label: 'NDVI Heatmap', value: showHeatmap, onChange: setShowHeatmap, icon: Activity, color: colors.primaryLight },
          { id: 'climate', label: 'Climate Hazards', value: showClimateRisk, onChange: setShowClimateRisk, icon: Sun, color: colors.warning },
          { id: 'pest', label: 'Pest Outbreaks', value: showPestRisk, onChange: setShowPestRisk, icon: Bug, color: colors.danger }
        ].map(layer => (
          <label key={layer.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '10px', color: colors.textSecondary, userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={layer.value}
              onChange={(e) => layer.onChange(e.target.checked)}
              style={{ accentColor: colors.primary, cursor: 'pointer' }}
            />
            <layer.icon size={11} color={layer.color} />
            <span>{layer.label}</span>
          </label>
        ))}
      </div>

      {/* 3. Bottom-Left Overlay: District summaries list */}
      <div 
        {...stopPropagation}
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 1000,
          background: colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.glassBorder}`,
          borderRadius: '12px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          width: '240px',
          fontFamily: typography.fontFamily,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '4px' }}>
          <Users size={12} color={colors.primaryLight} />
          <span style={{ fontSize: '10px', fontWeight: typography.bold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            District Summary
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {districtData.map((d) => (
            <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', padding: '2px 0' }}>
              <span style={{ color: colors.textPrimary }}>{d.name}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: colors.textMuted }}>{d.farmerCount} farmers</span>
                <span style={{
                  color: d.avgNdvi > 0.5 ? colors.success : d.avgNdvi > 0.3 ? colors.warning : colors.danger,
                  fontWeight: typography.bold
                }}>
                  {d.avgNdvi.toFixed(3)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom-Right Overlay: Stress distribution list & progress indicators */}
      <div 
        {...stopPropagation}
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          zIndex: 1000,
          background: colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.glassBorder}`,
          borderRadius: '12px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          width: '200px',
          fontFamily: typography.fontFamily,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '4px' }}>
          <Activity size={12} color={colors.primaryLight} />
          <span style={{ fontSize: '10px', fontWeight: typography.bold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Stress Distribution
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px' }}>
          {stressData.map((s) => {
            const total = stressData.reduce((acc, curr) => acc + curr.value, 0);
            const percentage = total > 0 ? (s.value / total) * 100 : 0;
            return (
              <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: colors.textPrimary }}>
                  <span>{s.name}</span>
                  <span style={{ fontWeight: typography.bold, color: s.color }}>{s.value} fields ({Math.round(percentage)}%)</span>
                </div>
                {/* Custom mini progress bar */}
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: s.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaflet MapContainer */}
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <MapController center={center} zoom={zoom} />
        <ZoomWatcher onZoomChange={setMapZoom} />
        
        {/* Esri World Imagery Satellite Tiles */}
        <TileLayer
          attribution='&copy; Esri World Imagery'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Zoomed Out View: District Clusters */}
        {mapZoom < 9 && districtClusters.map(d => (
          <Marker
            key={d.name}
            position={[d.lat, d.lon]}
            icon={createClusterIcon(d.name, d.counts, d.highestStress)}
            eventHandlers={{
              click: () => handleClusterClick(d)
            }}
          />
        ))}

        {/* Zoomed In View: Farm Boundaries & Markers */}
        {mapZoom >= 9 && showFarms && D.plots.map(farm => {
          const isSelected = selectedFarm?.id === farm.id;
          const statusColor = getFarmColor(farm);
          return (
            <div key={farm.id}>
              {/* Boundary Polygon */}
              {farm.boundaryPolygon && (
                <Polygon
                  positions={farm.boundaryPolygon}
                  eventHandlers={{
                    click: () => onSelectFarm(farm)
                  }}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : statusColor,
                    fillColor: statusColor,
                    fillOpacity: isSelected ? 0.6 : 0.25,
                    weight: isSelected ? 3 : 1.5
                  }}
                />
              )}

              {/* Pin marker */}
              <Marker
                position={[farm.lat, farm.lon]}
                icon={createFarmPinIcon(statusColor, isSelected)}
                eventHandlers={{
                  click: () => onSelectFarm(farm)
                }}
              />
            </div>
          );
        })}

        {/* Heatmap Layer: Large District outlines showing overall stress averages */}
        {showHeatmap && DISTRICTS.map(d => {
          const districtPlots = D.plots.filter(p => p.district === d.name);
          const avgNdvi = districtPlots.reduce((s, p) => s + p.ndvi, 0) / districtPlots.length;
          const color = avgNdvi >= 0.5 ? colors.success : avgNdvi >= 0.3 ? colors.warning : colors.danger;
          return DISTRICT_BOUNDS[d.name] && (
            <Polygon
              key={`heatmap-${d.name}`}
              positions={DISTRICT_BOUNDS[d.name]}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '3, 3'
              }}
            />
          );
        })}

        {/* Climate Risk Layer */}
        {showClimateRisk && (
          <>
            {/* Heatwave warnings centered on Solapur / Nashik */}
            <Circle
              center={[17.68, 75.90]}
              radius={24000}
              pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.12, weight: 1.5, dashArray: '6, 6' }}
            />
            <Circle
              center={[20.00, 73.70]}
              radius={20000}
              pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.12, weight: 1.5, dashArray: '6, 6' }}
            />
          </>
        )}

        {/* Pest Risk Layer */}
        {showPestRisk && (
          <>
            {/* Pest outbreak outlines in Pune / Nagpur */}
            <Circle
              center={[18.52, 73.85]}
              radius={18000}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.12, weight: 1.5, dashArray: '4, 4' }}
            />
            <Circle
              center={[21.15, 79.09]}
              radius={25000}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.12, weight: 1.5, dashArray: '4, 4' }}
            />
          </>
        )}

      </MapContainer>
    </div>
  );
}

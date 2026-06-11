import { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { colors, typography } from '../shared';
import { Sun, CloudRain, Droplets, Bug, AlertTriangle, Layers } from '../shared/icons';

// Center of Maharashtra districts to fit all threat zones
const MAP_CENTER = [19.5, 76.2];
const MAP_ZOOM = 6.5;

export default function ClimateRiskMap() {
  const [activeOverlays, setActiveOverlays] = useState({
    heatwave: true,
    flood: true,
    rain: true,
    pest: true,
    drought: true
  });

  const toggleOverlay = (key) => {
    setActiveOverlays(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper to prevent map events from leaking
  const stopPropagation = {
    onMouseDown: (e) => e.stopPropagation(),
    onClick: (e) => e.stopPropagation(),
    onWheel: (e) => e.stopPropagation(),
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '380px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: `1px solid ${colors.border}`
    }}>
      {/* Floating Toggle Controls */}
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
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          fontFamily: typography.fontFamily,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '3px', marginBottom: '2px' }}>
          <Layers size={11} color={colors.primaryLight} />
          <span style={{ fontSize: '9px', fontWeight: typography.bold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Risk Overlays
          </span>
        </div>

        {[
          { id: 'heatwave', label: 'Heatwave Areas', color: '#f59e0b', icon: Sun },
          { id: 'flood', label: 'Flood Risk Areas', color: '#06b6d4', icon: Droplets },
          { id: 'rain', label: 'Rain Alert Zones', color: '#3b82f6', icon: CloudRain },
          { id: 'pest', label: 'Pest Outbreaks', color: '#ef4444', icon: Bug },
          { id: 'drought', label: 'Drought Zones', color: '#d97706', icon: AlertTriangle }
        ].map(item => (
          <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '9px', color: colors.textSecondary, userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={activeOverlays[item.id]}
              onChange={() => toggleOverlay(item.id)}
              style={{ accentColor: item.color, cursor: 'pointer' }}
            />
            <item.icon size={10} color={item.color} />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        zoomControl={false}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        {/* Esri World Imagery Satellite Tiles */}
        <TileLayer
          attribution='&copy; Esri World Imagery'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* 1. Heatwave Areas (Orange) - Solapur / Nashik */}
        {activeOverlays.heatwave && (
          <>
            <Circle center={[17.68, 75.90]} radius={35000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Solapur Heatwave Hazard</strong><br/>Temps exceeding 41°C.</div></Popup>
            </Circle>
            <Circle center={[20.00, 73.70]} radius={30000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Nashik Heatwave Alert</strong><br/>Elevated moisture evapotranspiration.</div></Popup>
            </Circle>
          </>
        )}

        {/* 2. Flood Risk Areas (Cyan) - Pune / Nagpur */}
        {activeOverlays.flood && (
          <>
            <Circle center={[18.52, 73.85]} radius={28000} pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Pune River Basin Flood Risk</strong><br/>High runoff hazard in low-lying zones.</div></Popup>
            </Circle>
            <Circle center={[21.15, 79.09]} radius={32000} pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Nagpur Inundation Threat</strong><br/>Saturated soils showing critical water stress.</div></Popup>
            </Circle>
          </>
        )}

        {/* 3. Rain Alert Zones (Blue) - Pune / Nashik */}
        {activeOverlays.rain && (
          <>
            <Circle center={[18.8, 74.2]} radius={40000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Pune Rain Alert Zone</strong><br/>Heavy precipitation forecast (&gt;60mm in 24h).</div></Popup>
            </Circle>
            <Circle center={[20.3, 73.9]} radius={25000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Nashik Rain Zone</strong><br/>Scattered monsoon storms. Drain fields.</div></Popup>
            </Circle>
          </>
        )}

        {/* 4. Pest Outbreak Zones (Red) - Nagpur / Aurangabad */}
        {activeOverlays.pest && (
          <>
            <Circle center={[20.9, 78.8]} radius={30000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Nagpur Spodoptera Outbreak</strong><br/>Severe armyworm outbreak detected in cotton crops.</div></Popup>
            </Circle>
            <Circle center={[19.88, 75.34]} radius={26000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Aurangabad Pest Threat</strong><br/>Whitefly infestation threshold crossed.</div></Popup>
            </Circle>
          </>
        )}

        {/* 5. Drought Zones (Brown/Amber) - Solapur / Aurangabad */}
        {activeOverlays.drought && (
          <>
            <Circle center={[17.4, 75.4]} radius={35000} pathOptions={{ color: '#d97706', fillColor: '#d97706', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Solapur Moisture Drought</strong><br/>Critical groundwater deficits. Drought monitoring active.</div></Popup>
            </Circle>
            <Circle center={[19.5, 75.8]} radius={30000} pathOptions={{ color: '#d97706', fillColor: '#d97706', fillOpacity: 0.18, weight: 1.5 }}>
              <Popup><div style={{ color: '#000', fontSize: '11px', fontFamily: typography.fontFamily }}><strong>Aurangabad Dry Spell</strong><br/>NDWI water index &lt;0.05. Irrigation urgently needed.</div></Popup>
            </Circle>
          </>
        )}
      </MapContainer>
    </div>
  );
}

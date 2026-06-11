import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { colors, statusColor } from './colors';
import { typography } from './typography';
import { DISTRICTS, DISTRICT_BOUNDS } from '@/data/districts';

// Custom component to handle dynamic map update if center changes
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function DistrictMap({
  data = [],
  onDistrictClick,
  selectedDistrict,
  valueKey = 'avgNdvi',
  height = 300,
  showLabels = true,
}) {
  const [mapCenter] = useState([19.6, 76.3]); // Center of Maharashtra districts
  const [mapZoom] = useState(6.5);

  const getColor = (districtName) => {
    const entry = data.find(d => d.name === districtName || d.district === districtName);
    if (!entry) return colors.bgLighter;

    const val = entry[valueKey];
    if (typeof val === 'number') {
      if (val >= 0.5) return colors.success;
      if (val >= 0.3) return colors.warning;
      return colors.danger;
    }

    if (entry && entry.cropHealth) return statusColor(entry.cropHealth);
    return colors.primary;
  };

  const getValueText = (districtName) => {
    const entry = data.find(d => d.name === districtName || d.district === districtName);
    if (!entry) return '';
    const val = entry[valueKey];
    if (typeof val === 'number') {
      return val.toFixed(2);
    }
    return val || '';
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: `${height}px`,
      borderRadius: '12px',
      overflow: 'hidden',
      border: `1px solid ${colors.border}`
    }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        zoomControl={false}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        
        {/* Esri World Imagery Satellite Map */}
        <TileLayer
          attribution='&copy; Esri World Imagery'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* District Polygons */}
        {DISTRICTS.map((d) => {
          const isSelected = selectedDistrict === d.name;
          const districtColor = getColor(d.name);
          const bounds = DISTRICT_BOUNDS[d.name];

          if (!bounds) return null;

          return (
            <Polygon
              key={d.name}
              positions={bounds}
              eventHandlers={{
                click: () => onDistrictClick?.(d.name)
              }}
              pathOptions={{
                color: isSelected ? '#ffffff' : districtColor,
                fillColor: districtColor,
                fillOpacity: isSelected ? 0.55 : 0.25,
                weight: isSelected ? 2.5 : 1.5,
              }}
            />
          );
        })}

        {/* Labels Layer (using custom Leaflet markers at centroids) */}
        {showLabels && DISTRICTS.map((d) => {
          const valueText = getValueText(d.name);
          const labelIcon = L.divIcon({
            className: 'custom-district-label',
            html: `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', sans-serif;
                color: ${colors.textPrimary};
                text-shadow: 0px 2px 4px rgba(0,0,0,0.95), 0px 0px 2px rgba(0,0,0,1);
                pointer-events: none;
                text-align: center;
              ">
                <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">${d.name}</span>
                ${valueText ? `<span style="font-size: 9px; color: ${colors.textSecondary}; font-weight: 600; margin-top: 1px;">${valueKey === 'alertCount' ? 'Alerts: ' : ''}${valueText}</span>` : ''}
              </div>
            `,
            iconSize: [100, 30],
            iconAnchor: [50, 15]
          });

          return (
            <Marker
              key={`label-${d.name}`}
              position={[d.lat, d.lon]}
              icon={labelIcon}
              interactive={false}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

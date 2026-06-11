import { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

const applicantFarmIcon = L.divIcon({
  className: 'custom-applicant-icon',
  html: `
    <div style="
      width: 12px;
      height: 12px;
      background: #3b82f6;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

export default function ApplicantFarmMap({ farm }) {
  if (!farm || !farm.lat || !farm.lon) return null;

  const center = [farm.lat, farm.lon];

  return (
    <div style={{
      height: '180px',
      width: '100%',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(16, 185, 129, 0.15)'
    }}>
      <MapContainer
        center={center}
        zoom={14}
        zoomControl={false}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <MapRecenter center={center} />
        <TileLayer
          attribution='&copy; Esri World Imagery'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {farm.boundaryPolygon && (
          <Polygon
            positions={farm.boundaryPolygon}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.3,
              weight: 2
            }}
          />
        )}
        <Marker position={center} icon={applicantFarmIcon} />
      </MapContainer>
      
      {/* Dynamic Overlay Label */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(10, 24, 16, 0.85)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '6px',
        padding: '3px 8px',
        fontSize: '9px',
        color: '#93c5fd',
        fontFamily: 'Inter, sans-serif'
      }}>
        Sentinel-2 Satellite L2A boundary overlay
      </div>
    </div>
  );
}

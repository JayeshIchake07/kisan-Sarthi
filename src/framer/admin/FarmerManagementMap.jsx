import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { colors } from '../shared/colors';

// Custom farm marker pin SVGs (using status colors)
const createFarmIcon = (color) => L.divIcon({
  className: 'custom-farm-pin',
  html: `
    <div style="
      width: 14px;
      height: 14px;
      background: ${color};
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.6);
    "></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Map control action component
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function FarmerManagementMap({ plots = [], selectedPlot = null, onSelectPlot }) {
  const [center, setCenter] = useState([19.50, 76.00]); // center of Maharashtra
  const [zoom, setZoom] = useState(7);

  // If a plot is selected externally (e.g. from the table), center map on it and zoom in
  useEffect(() => {
    if (selectedPlot) {
      setCenter([selectedPlot.lat, selectedPlot.lon]);
      setZoom(13);
    }
  }, [selectedPlot]);

  const getStatusColor = (stress) => {
    if (stress === 'healthy') return colors.success;
    if (stress === 'mild') return colors.warning;
    return colors.danger;
  };

  const handlePlotClick = (plot) => {
    onSelectPlot(plot);
    setCenter([plot.lat, plot.lon]);
    setZoom(13);
  };

  return (
    <div style={{ width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${colors.border}` }}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <MapController center={center} zoom={zoom} />
        
        {/* Esri World Imagery Satellite Tiles */}
        <TileLayer
          attribution='&copy; Esri World Imagery'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Polygons & Pins */}
        {plots.map((plot) => {
          const isSelected = selectedPlot?.id === plot.id;
          const statusColor = getStatusColor(plot.stress);

          return (
            <div key={plot.id}>
              {/* Field Polygon */}
              {plot.boundaryPolygon && (
                <Polygon
                  positions={plot.boundaryPolygon}
                  eventHandlers={{
                    click: () => handlePlotClick(plot)
                  }}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : statusColor,
                    fillColor: statusColor,
                    fillOpacity: isSelected ? 0.6 : 0.25,
                    weight: isSelected ? 3 : 1.5,
                  }}
                />
              )}

              {/* Pin Marker */}
              <Marker
                position={[plot.lat, plot.lon]}
                icon={createFarmIcon(statusColor)}
                eventHandlers={{
                  click: () => handlePlotClick(plot)
                }}
              />
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}

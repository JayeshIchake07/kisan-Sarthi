/**
 * Converts geographic coordinates to canvas pixel positions.
 *
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} W - Canvas width in pixels
 * @param {number} H - Canvas height in pixels
 * @param {{minLat: number, maxLat: number, minLon: number, maxLon: number}} bounds
 * @param {number} [pad=28] - Padding in pixels
 * @returns {{x: number, y: number}}
 */
export function geoToPixel(lat, lon, W, H, bounds, pad = 28) {
  const { minLat, maxLat, minLon, maxLon } = bounds;
  return {
    x: pad + ((lon - minLon) / (maxLon - minLon || 0.01)) * (W - pad * 2),
    y: pad + ((maxLat - lat) / (maxLat - minLat || 0.01)) * (H - pad * 2),
  };
}

/**
 * Calculates geographic bounds from an array of plots.
 *
 * @param {Array<{lat: number, lon: number}>} plots
 * @returns {{minLat: number, maxLat: number, minLon: number, maxLon: number}}
 */
export function calcBounds(plots) {
  const lats = plots.map((p) => p.lat);
  const lons = plots.map((p) => p.lon);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
  };
}

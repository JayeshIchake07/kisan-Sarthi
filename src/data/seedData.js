import { sr } from "../utils/seededRandom";
import { DISTRICTS } from "./districts";
import { CROPS } from "./crops";
import { NAMES } from "./farmers";

/**
 * @typedef {Object} Plot
 * @property {number} id
 * @property {string} farmer
 * @property {string} initials
 * @property {string} phone
 * @property {string} crop
 * @property {number} lat
 * @property {number} lon
 * @property {number} acres
 * @property {number} ndvi
 * @property {number} ndwi
 * @property {"severe"|"mild"|"healthy"} stress
 * @property {string} district
 * @property {number} fpoId
 * @property {number} sowDays
 * @property {"mr"|"hi"} lang
 */

/**
 * @typedef {Object} HistoryPoint
 * @property {number} day
 * @property {number} ndvi
 */

/**
 * @typedef {Object} MarketEntry
 * @property {string} commodity
 * @property {string} mandi
 * @property {string} district
 * @property {number} price
 */

/**
 * @typedef {Object} SeedData
 * @property {Plot[]} plots
 * @property {Record<number, HistoryPoint[]>} hist
 * @property {MarketEntry[]} market
 */

/**
 * Builds the complete demo dataset using a seeded PRNG for deterministic output.
 * @returns {SeedData}
 */
function buildData() {
  const r = sr(42);
  const plots = [];
  const hist = {};

  NAMES.forEach((name, fi) => {
    const d = DISTRICTS[fi % DISTRICTS.length];
    const stressed = r() < 0.28;
    const base = stressed ? 0.10 + r() * 0.20 : 0.42 + r() * 0.30;
    const id = fi + 1;

    const lat = +(d.lat + (r() - 0.5) * 0.5).toFixed(4);
    const lon = +(d.lon + (r() - 0.5) * 0.5).toFixed(4);
    const ndvi = +base.toFixed(3);
    const ndwi = +(r() * 0.25 + 0.05).toFixed(3);

    const riskScore = Math.max(0, Math.min(100, Math.round((1 - ndvi) * 75 + (0.3 - ndwi) * 80)));
    const radiusLat = 0.0006 + r() * 0.0003;
    const radiusLon = 0.0006 + r() * 0.0003;
    
    const boundaryPolygon = [
      [+(lat - radiusLat - r() * 0.0002).toFixed(5), +(lon - radiusLon - r() * 0.0002).toFixed(5)],
      [+(lat - radiusLat + r() * 0.0002).toFixed(5), +(lon + radiusLon + r() * 0.0002).toFixed(5)],
      [+(lat + radiusLat + r() * 0.0002).toFixed(5), +(lon + radiusLon - r() * 0.0002).toFixed(5)],
      [+(lat + radiusLat - r() * 0.0002).toFixed(5), +(lon - radiusLon + r() * 0.0002).toFixed(5)],
    ];

    plots.push({
      id,
      farmer: name,
      initials: name.split(" ").map((w) => w[0]).join(""),
      phone: `9${Math.floor(r() * 900000000 + 100000000)}`,
      crop: CROPS[Math.floor(r() * CROPS.length)],
      lat,
      lon,
      acres: +(r() * 4 + 0.5).toFixed(1),
      ndvi,
      ndwi,
      stress: base < 0.2 ? "severe" : base < 0.4 ? "mild" : "healthy",
      district: d.name,
      fpoId: (fi % 5) + 1,
      sowDays: Math.floor(r() * 70 + 20),
      lang: fi % 6 === 5 ? "hi" : "mr",
      riskScore,
      boundaryPolygon,
    });

    const h = [];
    for (let k = 35; k >= 0; k--) {
      const g = Math.sin(((35 - k) / 35) * Math.PI) * 0.18;
      h.push({
        day: k * 5,
        ndvi: +Math.max(0.05, Math.min(0.95, base * 0.75 + g + (r() - 0.5) * 0.07)).toFixed(3),
      });
    }
    hist[id] = h;
  });

  const market = CROPS.flatMap((crop, ci) =>
    DISTRICTS.map((d, di) => ({
      commodity: crop,
      mandi: `${d.name} APMC`,
      district: d.name,
      price: Math.floor(sr(ci * 31 + di * 7 + 1)() * 1200 + 700),
    }))
  );

  return { plots, hist, market };
}

/**
 * Singleton demo dataset — deterministic across all renders.
 * @type {SeedData}
 */
export const D = buildData();

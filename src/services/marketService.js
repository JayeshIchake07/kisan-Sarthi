import { D } from "../data/seedData";

/**
 * Retrieves market prices for a given crop, sorted by price descending.
 * Currently reads from demo data; ready for backend API swap.
 *
 * @param {string} crop - Crop name (e.g., "Onion")
 * @returns {Promise<import("../data/seedData").MarketEntry[]>}
 */
export async function getMarketPrices(crop) {
  // In production, replace with: fetch(`/api/market?crop=${crop}`)
  return D.market
    .filter((p) => p.commodity === crop)
    .sort((a, b) => b.price - a.price);
}

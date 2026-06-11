import { useState, useMemo } from "react";
import { D } from "../data/seedData";

/**
 * Hook managing market price filtering and sorting.
 *
 * @param {string} [initialCrop="Onion"] - Default crop to filter
 * @returns {Object} Prices, selected crop, and crop setter
 */
export function useMarketPrices(initialCrop = "Onion") {
  const [crop, setCrop] = useState(initialCrop);

  const prices = useMemo(
    () =>
      D.market
        .filter((p) => p.commodity === crop)
        .sort((a, b) => b.price - a.price),
    [crop]
  );

  const best = prices[0]?.price || 0;
  const worst = prices[prices.length - 1]?.price || 0;

  return { crop, setCrop, prices, best, worst };
}

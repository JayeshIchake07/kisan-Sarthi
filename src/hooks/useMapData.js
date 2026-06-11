import { useState, useMemo } from "react";
import { D } from "../data/seedData";

/**
 * Hook encapsulating satellite map screen state:
 * filter, selection, and computed stats.
 *
 * @returns {Object} Map data state and actions
 */
export function useMapData() {
  const [filter, setFilter] = useState("all");
  const [selId, setSelId] = useState(null);

  const plots = useMemo(
    () =>
      filter === "all"
        ? D.plots
        : D.plots.filter((p) => p.stress === filter),
    [filter]
  );

  const sel = useMemo(
    () => D.plots.find((p) => p.id === selId) || null,
    [selId]
  );

  const stats = useMemo(
    () => ({
      healthy: D.plots.filter((p) => p.stress === "healthy").length,
      mild: D.plots.filter((p) => p.stress === "mild").length,
      severe: D.plots.filter((p) => p.stress === "severe").length,
    }),
    []
  );

  return {
    filter,
    setFilter,
    selId,
    setSelId,
    plots,
    sel,
    stats,
  };
}

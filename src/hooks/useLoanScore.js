import { useState, useCallback } from "react";
import { getLoanScore } from "../services/scoringService";

/**
 * Hook managing loan score lookup state.
 *
 * @returns {Object} Score result, loading state, and search action
 */
export function useLoanScore() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (plotId) => {
    const id = parseInt(plotId);
    if (!id || id < 1 || id > 20) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getLoanScore(id);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to calculate score.");
      setResult(null);
    }
    setLoading(false);
  }, []);

  return { result, loading, error, search };
}

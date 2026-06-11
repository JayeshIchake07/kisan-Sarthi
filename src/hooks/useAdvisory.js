import { useState, useCallback } from "react";
import { generateStructuredAdvisory } from "../services/advisoryService";

/**
 * Hook managing AI advisory generation state.
 * Returns parsed structured advisory report.
 *
 * @returns {Object} Advisory state and generate action
 */
export function useAdvisory() {
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (plot, lang = 'en') => {
    if (!plot) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateStructuredAdvisory(plot, lang);
      setAdvisory(data);
    } catch (err) {
      setError(err.message || "Network error. Check connectivity.");
      setAdvisory(null);
    }
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setAdvisory(null);
    setError(null);
  }, []);

  return { advisory, loading, error, generate, reset };
}

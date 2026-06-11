import { useState, useEffect } from 'react';
import { getClimateAlerts } from '@/services/climateService';

/**
 * Hook wrapping climateService.getClimateAlerts() in React state.
 * Used by Farmer, Admin, and Government dashboards.
 */
export function useClimateAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAlerts() {
      try {
        const data = await getClimateAlerts();
        if (mounted) {
          setAlerts(data.alerts);
          setVulnerabilities(data.vulnerabilities);
          setHistory(data.history);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAlerts();
    return () => { mounted = false; };
  }, []);

  return { alerts, vulnerabilities, history, loading, error };
}

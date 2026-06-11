import { useState, useEffect, useCallback } from 'react';
import { getSchemesWithEligibility } from '../services/schemesService';
import { callGemini } from '../services/geminiService';
import { useLanguage } from './useLanguage';

/**
 * Hook to manage government schemes state and AI explanation actions.
 *
 * @param {import("../data/seedData").Plot} plot
 */
export function useSchemes(plot) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [explainingId, setExplainingId] = useState(null);
  const [explanations, setExplanations] = useState({}); // schemeId -> text
  const { lang } = useLanguage();

  const loadSchemes = useCallback(async () => {
    if (!plot) return;
    setLoading(true);
    try {
      const data = await getSchemesWithEligibility(plot);
      setSchemes(data);
    } catch (e) {
      console.error('Error loading schemes:', e);
    }
    setLoading(false);
  }, [plot]);

  useEffect(() => {
    loadSchemes();
  }, [loadSchemes]);

  const explainBenefits = useCallback(async (scheme) => {
    if (!scheme || !plot) return;
    setExplainingId(scheme.id);
    const langNames = { en: 'English', mr: 'Marathi', hi: 'Hindi' };
    const responseLang = langNames[lang] || 'English';
    try {
      const prompt = `You are Kisan Sarthi, a helpful government scheme guide.
Scheme Name: ${scheme.name} (${scheme.fullName})
Farmer Details: Name: ${plot.farmer}, Crop: ${plot.crop}, District: ${plot.district}, Area: ${plot.acres} acres.
Eligibility Status: ${scheme.eligibility.status} (Reason: ${scheme.eligibility.reason})

IMPORTANT: Respond ONLY in ${responseLang}. Do not mix languages.

Provide a friendly 2-3 sentence explanation of how this farmer can claim this scheme, what papers they need (like Aadhaar, land record 7/12, etc.), and what the main benefit is. Keep it direct and helpful.`;

      const explanationText = await callGemini(prompt);
      setExplanations(prev => ({ ...prev, [scheme.id]: explanationText }));
    } catch (e) {
      console.error('Error explaining scheme:', e);
      setExplanations(prev => ({ ...prev, [scheme.id]: 'Failed to generate explanation. Check connection.' }));
    }
    setExplainingId(null);
  }, [plot, lang]);

  return {
    schemes,
    loading,
    explainingId,
    explanations,
    explainBenefits,
    refetch: loadSchemes
  };
}

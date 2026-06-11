import { calcScore } from "../utils/scoringUtils";
import { D } from "../data/seedData";

/**
 * Retrieves a loan score for a given plot ID.
 * Currently computed from demo data; ready for backend API swap.
 *
 * @param {number} plotId - The plot ID (1–20)
 * @returns {Promise<{score: number, con: number, hlt: number, trn: number, plot: import("../data/seedData").Plot} | null>}
 */
export async function getLoanScore(plotId) {
  // Simulate network latency for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 700));

  const scoreData = calcScore(plotId, D.hist);
  const plot = D.plots.find((p) => p.id === plotId);

  if (!scoreData || !plot) return null;

  return { ...scoreData, plot };
}

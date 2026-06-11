/**
 * Calculates a satellite-based crop health score for loan assessment.
 *
 * The score is a weighted composite of:
 * - Consistency (40%): How stable NDVI readings are over time
 * - Health (40%): Current NDVI level
 * - Trend (20%): Recent improvement or decline
 *
 * @param {number} pid - Plot ID
 * @param {Record<number, Array<{ndvi: number}>>} histData - NDVI history map
 * @returns {{score: number, con: number, hlt: number, trn: number} | null}
 */
export function calcScore(pid, histData) {
  const h = histData[pid];
  if (!h || h.length < 5) return null;

  const vals = h.map((x) => x.ndvi);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const std = Math.sqrt(
    vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length
  );

  const con = Math.max(0, Math.min(100, 100 - std * 300));
  const hlt = Math.min(100, vals[vals.length - 1] * 150);
  const trn = Math.max(
    0,
    Math.min(100, 50 + (vals[vals.length - 1] - vals[vals.length - 4]) * 200)
  );

  return {
    score: Math.round(con * 0.4 + hlt * 0.4 + trn * 0.2),
    con: Math.round(con),
    hlt: Math.round(hlt),
    trn: Math.round(trn),
  };
}

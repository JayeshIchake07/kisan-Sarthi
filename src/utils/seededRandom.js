/**
 * Seeded pseudo-random number generator (Lehmer / Park-Miller).
 * Returns a function that produces deterministic floats in [0, 1).
 *
 * @param {number} seed - Integer seed value
 * @returns {() => number} PRNG function
 */
export function sr(seed) {
  let s = seed % 2147483647;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Environment configuration.
 * Reads Vite environment variables with safe fallbacks.
 */

/** @type {string} Gemini API key */
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

/** @type {string} Gemini model to use */
export const GEMINI_MODEL =
  import.meta.env.VITE_GEMINI_MODEL || "gemini-3.5-flash";

/** @type {boolean} */
export const IS_DEV = import.meta.env.DEV;

/** @type {string} */
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "2.0.0";

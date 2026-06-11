import { GEMINI_API_KEY, GEMINI_MODEL } from "./environment";

/**
 * API configuration for Gemini service calls.
 *
 * @returns {{geminiApiKey: string, geminiModel: string, timeout: number}}
 */
export function getApiConfig() {
  return {
    geminiApiKey: GEMINI_API_KEY,
    geminiModel: GEMINI_MODEL,
    timeout: 30000,
  };
}

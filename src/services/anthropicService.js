import { getApiConfig } from "../config/api";

/**
 * Calls the Anthropic Messages API with a given prompt.
 * Reads the API key from environment configuration.
 *
 * @param {string} prompt - The user prompt to send
 * @returns {Promise<string>} The text response from Claude
 * @throws {Error} On network failure or missing API key
 */
export async function callAnthropic(prompt) {
  const { anthropicApiKey, anthropicModel, anthropicBaseUrl } = getApiConfig();

  if (!anthropicApiKey) {
    console.warn(
      "[Kisan Sarthi] No VITE_ANTHROPIC_API_KEY set. AI features will return fallback text."
    );
    return "AI advisory unavailable — configure VITE_ANTHROPIC_API_KEY in .env";
  }

  const res = await fetch(`${anthropicBaseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: 380,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Anthropic API error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || "Unable to generate.";
}

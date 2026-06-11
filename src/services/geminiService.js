import { getApiConfig } from "../config/api";

/**
 * Calls the Google Gemini generateContent API with a given prompt.
 * Uses the REST endpoint directly (no SDK needed in Vite browser context).
 *
 * @param {string} prompt - The user prompt to send
 * @returns {Promise<string>} The text response from Gemini
 * @throws {Error} On network failure or missing API key
 */
export async function callGemini(prompt) {
  const { geminiApiKey, geminiModel } = getApiConfig();

  if (!geminiApiKey) {
    console.warn(
      "[Kisan Sarthi] No VITE_GEMINI_API_KEY set. AI features will return fallback text."
    );
    return "AI advisory unavailable — add VITE_GEMINI_API_KEY to your .env file.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Gemini API error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Unable to generate advisory."
  );
}

const API_BASE_URL =
  process.env.HACKATHON_API_URL ||
  "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Authenticate with the hackathon API and get a bearer token.
 * Token is cached in memory and reused until expiry.
 */
async function getHackathonToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const nickname = process.env.HACKATHON_NICKNAME;
  const password = process.env.HACKATHON_PASSWORD;

  if (!nickname || !password) {
    throw new Error(
      "HACKATHON_NICKNAME and HACKATHON_PASSWORD must be set in .env"
    );
  }

  const formData = new URLSearchParams();
  formData.append("nickName", nickname);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    body: formData,
    redirect: "manual",
  });

  // The API redirects with the token in the URL
  const location = response.headers.get("location") || "";
  const tokenMatch = location.match(/token=([^&]+)/);

  if (tokenMatch?.[1]) {
    cachedToken = tokenMatch[1];
    // Cache for 50 minutes (assuming 1h expiry)
    tokenExpiresAt = Date.now() + 50 * 60 * 1000;
    return cachedToken;
  }

  // If no redirect, try parsing the response body
  const text = await response.text();
  const bodyMatch = text.match(/token[=:]\s*["']?([A-Za-z0-9._-]+)/);
  if (bodyMatch?.[1]) {
    cachedToken = bodyMatch[1];
    tokenExpiresAt = Date.now() + 50 * 60 * 1000;
    return cachedToken;
  }

  throw new Error(`Failed to obtain hackathon API token. Status: ${response.status}`);
}

/**
 * Register a team with the hackathon API.
 */
export async function registerHackathonTeam(): Promise<void> {
  const nickname = process.env.HACKATHON_NICKNAME;
  const teamName = process.env.HACKATHON_TEAM;
  const password = process.env.HACKATHON_PASSWORD;

  if (!nickname || !teamName || !password) {
    throw new Error(
      "HACKATHON_NICKNAME, HACKATHON_TEAM, and HACKATHON_PASSWORD must be set"
    );
  }

  const formData = new URLSearchParams();
  formData.append("nickName", nickname);
  formData.append("teamName", teamName);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Hackathon registration failed: ${response.status}`);
  }
}

// ─── Weather API ──────────────────────────────────────────

export interface WeatherData {
  [key: string]: unknown;
}

/**
 * Fetch weather data from the hackathon API.
 * @param disaster - Whether to request disaster scenario data
 */
export async function fetchWeather(
  disaster: boolean = false
): Promise<WeatherData> {
  const token = await getHackathonToken();

  const response = await fetch(
    `${API_BASE_URL}/weather?disaster=${disaster}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  );

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  return response.json();
}

// ─── LLM API ──────────────────────────────────────────────

export interface LlmResponse {
  [key: string]: unknown;
}

/**
 * Send a prompt to the hackathon LLM API.
 * @param systemPrompt - System instructions for the LLM
 * @param userPrompt - User query for the LLM
 */
export async function queryLlm(
  systemPrompt: string,
  userPrompt: string
): Promise<LlmResponse> {
  const token = await getHackathonToken();

  const response = await fetch(`${API_BASE_URL}/prompt`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  return response.json();
}

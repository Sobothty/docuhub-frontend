// Centralized API configuration and endpoints
// Adjust or extend as your backend grows

export const API_ENDPOINTS = {
  PAPERS: {
    PUBLISHED: "/papers/published",
  },
} as const;

export function getApiConfig() {
  // Prefer public URL for client-safe contexts, fallback to server-only var
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";

  if (!baseUrl) {
    // Keeping it non-throwing to avoid breaking builds; upstream route can handle empty base
    // console.warn("Base URL is not set. Please define NEXT_PUBLIC_BASE_URL or BASE_URL.");
  }

  return { baseUrl };
}

export const configs = {
  apiUrl: import.meta.env.VITE_API_URL || "https://gb-crm-3.vertekx.com",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
} as const;

export default configs;

export const configs = {
  apiUrl: import.meta.env.VITE_API_URL || "https://gb-crm-3.vertekx.com",
  headers: {
    "Content-Type": "application/json",
  },
} as const;

export default configs;

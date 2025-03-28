export const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "development"
    ? ""
    : "https://lms-ci8t.onrender.com");

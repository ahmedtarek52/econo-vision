const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://econo-vision-backend.fly.dev"); // replace with your Fly.io backend domain

export default API_BASE_URL;

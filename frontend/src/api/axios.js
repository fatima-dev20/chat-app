import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: backendUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default api;

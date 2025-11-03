// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://0d9ffd8a6329.ngrok-free.app/",
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
});

// Chỉ thêm token – KHÔNG can thiệp Content-Type
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

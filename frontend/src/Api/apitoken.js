// src/api.js
import axios from "axios";

const TOKEN_KEY = "authToken";
const ROLE_KEY = "userRole"; // admin | user
const TOKEN_TIME_KEY = "tokenTime"; // lưu thời điểm lưu token
const EXPIRE_TIME = 60 * 60 * 1000; // 1 giờ = 3600000 ms

// Hàm kiểm tra hết hạn token
function checkTokenExpired() {
  const savedTime = localStorage.getItem(TOKEN_TIME_KEY);
  if (!savedTime) return false;

  const now = Date.now();
  const diff = now - Number(savedTime);

  if (diff > EXPIRE_TIME) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(TOKEN_TIME_KEY);
    console.log("⚠ Token đã hết hạn và bị xóa!");
    return true;
  }
  return false;
}

const api = axios.create({
  baseURL: "https://151d63c33047.ngrok-free.app/",
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
});

// INTERCEPTOR REQUEST: kiểm tra token + attach header
api.interceptors.request.use(
  (config) => {
    // Kiểm tra token có hết hạn không
    const expired = checkTokenExpired();
    if (expired) return Promise.reject("Token expired");

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR RESPONSE: lưu token & role khi login
api.interceptors.response.use(
  (response) => {
    // ✅ Hỗ trợ cả 2 structure
    const token = response.data?.token || response.data?.data?.token;
    const role = response.data?.role || response.data?.data?.role || "user";
    const userInfo = response.data?.user || response.data?.data?.user;

    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("tokenTime", Date.now().toString());

      if (userInfo) {
        localStorage.setItem("user", JSON.stringify(userInfo));
      }

      console.log("✅ Token, Role & User đã được lưu");
    }

    return response;
  },
  (error) => {
    // TH token hết hạn (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(TOKEN_TIME_KEY);
      console.log("⚠ Token hết hạn (401) → Đã auto logout");
    }
    return Promise.reject(error);
  }
);

export default api;
export const getRole = () => localStorage.getItem("userRole");

export const isAdmin = () => getRole() === "admin";

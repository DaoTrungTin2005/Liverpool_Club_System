import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://57f0967407fe.ngrok-free.app", // backend ngrok của bạn
        changeOrigin: true,
        secure: false, // nếu backend ngrok dùng cert tự ký
        ws: false,
      },
    },
  },
});

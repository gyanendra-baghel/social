import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const apiUrl = isDevelopment
    ? "http://localhost:5000"
    : "https://social-5lms.onrender.com";

  if (!apiUrl)
    throw new Error(`apiUrl is not defined in ${process.env.NODE_ENV}`);
  else console.log("apiUrl in", process.env.NODE_ENV, apiUrl);

  return {
    plugins: [react()],
    define: {
      apiUrl: JSON.stringify("https://social-5lms.onrender.com"),
    },
    server: {
      proxy: {
        "/socket.io": {
          target: "https://social-5lms.onrender.com",
          changeOrigin: true,
          ws: true, // enable WebSocket proxying
        },
        "/api": {
          target: "https://social-5lms.onrender.com",
          changeOrigin: true,
        },
      },
    },
  };
});
// https://social-hazel.vercel.app

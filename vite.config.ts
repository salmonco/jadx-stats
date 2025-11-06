import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import path from "path";

export default defineConfig({
  base: "/stats/",
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      "~": `${path.resolve(__dirname, "src")}/`,
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://agri.jeju.go.kr',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    host: true,
    allowedHosts: ['hack.hypurrquant.com'],
    port: 4173,
    proxy: {
      '/api': {
        target: 'https://agri.jeju.go.kr',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
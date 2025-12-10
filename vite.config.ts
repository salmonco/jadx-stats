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
      "/api": {
        // TODO: 배포 시 실제 서버 주소로 변경 필요 (현재는 개발용 서버로 설정)
        // target: 'https://agri.jeju.go.kr',
        target: "https://dev-agri.todayjeju.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: true,
    allowedHosts: ["hack.hypurrquant.com"],
    port: 4173,
    proxy: {
      "/api": {
        // TODO: 배포 시 실제 서버 주소로 변경 필요 (현재는 개발용 서버로 설정)
        // target: 'https://agri.jeju.go.kr',
        target: "https://dev-agri.todayjeju.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

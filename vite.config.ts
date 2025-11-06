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
  preview: {
    host: true, // 0.0.0.0으로 바인딩
    allowedHosts: ['hack.hypurrquant.com'], // 외부 접근 허용할 호스트 추가
    port: 4173, // 기존 포트 유지
  },
});

import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigProvider } from "antd";
import locale from "antd/locale/ko_KR";
import "./index.css";
import "./maps/styles/ol.css";

// @ts-ignore
const router = createRouter({
  routeTree,
  basepath: "/stats",
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: "#37445E",
          colorText: "#222222",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  </AuthProvider>
);

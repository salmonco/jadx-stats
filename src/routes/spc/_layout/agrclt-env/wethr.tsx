import { createFileRoute, redirect } from "@tanstack/react-router";
import { WeatherVariableAnalysis } from "~/pages/visualization";
import { PRIV_AUTH, ADMIN_AUTH } from "~/utils/common";

export const Route = createFileRoute("/spc/_layout/agrclt-env/wethr")({
  beforeLoad: () => {
    const auth = localStorage.getItem("mock_auth");

    // 로그인 여부
    if (!auth) {
      throw redirect({
        to: "/login",
      });
    }

    // 권한 체크(농협/수급관리센터만 허용)
    if (!PRIV_AUTH.has(auth) && !ADMIN_AUTH.has(auth)) {
      throw redirect({
        to: "/403",
      });
    }
  },
  component: () => <WeatherVariableAnalysis />,
});

import { createFileRoute, redirect } from "@tanstack/react-router";
import GeneralGis from "~/pages/gis";
import { ADMIN_AUTH } from "~/utils/common";

export const Route = createFileRoute("/gis")({
  beforeLoad: () => {
    const auth = localStorage.getItem("mock_auth");

    // 로그인 여부
    if (!auth) {
      throw redirect({
        to: "/login",
      });
    }

    // 권한 체크(관리자만 허용)
    if (!ADMIN_AUTH.has(auth)) {
      throw redirect({
        to: "/403",
      });
    }
  },
  component: () => <GeneralGis />,
});

import { createFileRoute } from "@tanstack/react-router";
import Assets from "~/pages/statistics/farmEconomy/Assets";

export const Route = createFileRoute("/bsc/_layout/ecnm/ast")({
  component: RouteComponent,
});

// 농가 자산
function RouteComponent() {
  return <Assets />;
}

import { createFileRoute } from "@tanstack/react-router";
import KeyIndicators from "~/pages/statistics/farmEconomy/KeyIndicators";

export const Route = createFileRoute("/bsc/_layout/ecnm/key-idct")({
  component: RouteComponent,
});

// 농가경제 주요지표
function RouteComponent() {
  return <KeyIndicators />;
}

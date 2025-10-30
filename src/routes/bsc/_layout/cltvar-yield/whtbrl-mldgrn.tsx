import { createFileRoute } from "@tanstack/react-router";
import WheatAndBarleyMilledGrain from "~/pages/statistics/cultivationAreaAndYield/WheatAndBarleyMilledGrains";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/whtbrl-mldgrn")({
  component: RouteComponent,
});

// 식량작물 - 맥류(정곡)
function RouteComponent() {
  return <WheatAndBarleyMilledGrain />;
}

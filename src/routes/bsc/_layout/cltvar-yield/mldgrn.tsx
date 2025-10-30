import { createFileRoute } from "@tanstack/react-router";
import MilledGrains from "~/pages/statistics/cultivationAreaAndYield/MilledGrains";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/mldgrn")({
  component: RouteComponent,
});

// 식량작물 - 정곡
function RouteComponent() {
  return <MilledGrains />;
}

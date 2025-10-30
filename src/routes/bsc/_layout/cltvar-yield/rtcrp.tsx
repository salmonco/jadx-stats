import { createFileRoute } from "@tanstack/react-router";
import RootAndTuberCrops from "~/pages/statistics/cultivationAreaAndYield/RootAndTuberCrops";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/rtcrp")({
  component: RouteComponent,
});

// 식량작물 - 서류
function RouteComponent() {
  return <RootAndTuberCrops />;
}

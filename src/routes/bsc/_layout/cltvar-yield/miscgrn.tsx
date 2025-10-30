import { createFileRoute } from "@tanstack/react-router";
import MiscellaneousGrains from "~/pages/statistics/cultivationAreaAndYield/MiscellaneousGrains";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/miscgrn")({
  component: RouteComponent,
});

// 식량작물 - 잡곡
function RouteComponent() {
  return <MiscellaneousGrains />;
}

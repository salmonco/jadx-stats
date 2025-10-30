import { createFileRoute } from "@tanstack/react-router";
import WheatAndBarleyRoughGrains from "~/pages/statistics/cultivationAreaAndYield/WheatAndBarleyRoughGrains";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/whtbrl-rghgrn")({
  component: RouteComponent,
});

// 식량작물 - 맥류(조곡)
function RouteComponent() {
  return <WheatAndBarleyRoughGrains />;
}

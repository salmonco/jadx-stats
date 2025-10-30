import { createFileRoute } from "@tanstack/react-router";
import Pulses from "~/pages/statistics/cultivationAreaAndYield/Pulses";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/pls")({
  component: RouteComponent,
});

// 식량작물 - 두류
function RouteComponent() {
  return <Pulses />;
}

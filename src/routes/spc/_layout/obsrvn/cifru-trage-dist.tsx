import { createFileRoute } from "@tanstack/react-router";
import { MandarinTreeAgeDistribution } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/obsrvn/cifru-trage-dist")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MandarinTreeAgeDistribution />;
}

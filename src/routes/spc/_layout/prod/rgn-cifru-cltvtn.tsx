import { createFileRoute } from "@tanstack/react-router";
import { MandarinCultivationInfo } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/prod/rgn-cifru-cltvtn")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MandarinCultivationInfo />;
}

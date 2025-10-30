import { createFileRoute } from "@tanstack/react-router";
import { HibernationVegetableCultivation } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/prod/cltvar-chag")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HibernationVegetableCultivation />;
}

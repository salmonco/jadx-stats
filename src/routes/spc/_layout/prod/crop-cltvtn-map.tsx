import { createFileRoute } from "@tanstack/react-router";
import { CropDistribution } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/prod/crop-cltvtn-map")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CropDistribution />;
}

import { createFileRoute } from "@tanstack/react-router";
import { QualityAnalysis } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/obsrvn/qlty")({
    component: RouteComponent,
});

function RouteComponent() {
    return <QualityAnalysis />;
}

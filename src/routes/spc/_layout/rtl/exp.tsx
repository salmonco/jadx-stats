import { createFileRoute } from "@tanstack/react-router";
import { YearlyCountryExportInfo } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/rtl/exp")({
    component: RouteComponent,
});

function RouteComponent() {
    return <YearlyCountryExportInfo />;
}

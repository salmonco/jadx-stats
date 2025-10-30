import { createFileRoute } from "@tanstack/react-router";
import AgrochemicalAndFertilizerSales from "~/pages/statistics/productionMaterials/AgrochemicalAndFertilizerSales";

export const Route = createFileRoute("/bsc/_layout/prdctn-mtrl/agrchm-frtlzr-ntsl")({
  component: RouteComponent,
});

// 농약, 비료 판매 현황
function RouteComponent() {
  return <AgrochemicalAndFertilizerSales />;
}

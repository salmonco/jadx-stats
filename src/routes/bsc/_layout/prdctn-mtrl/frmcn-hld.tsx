import { createFileRoute } from "@tanstack/react-router";
import FarmMachineryHoldings from "~/pages/statistics/productionMaterials/FarmMachineryHoldings";

export const Route = createFileRoute("/bsc/_layout/prdctn-mtrl/frmcn-hld")({
  component: RouteComponent,
});

// 농기계 보유 현황
function RouteComponent() {
  return <FarmMachineryHoldings />;
}

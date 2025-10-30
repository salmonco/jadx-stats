import { createFileRoute } from "@tanstack/react-router";
import { WholesaleMarketShare } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/rtl/whlsl-mrkt-share")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WholesaleMarketShare />;
}

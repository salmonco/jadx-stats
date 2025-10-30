import { createFileRoute } from "@tanstack/react-router";
import { CropTradeInfo } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/rtl/crop-trade")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CropTradeInfo />;
}

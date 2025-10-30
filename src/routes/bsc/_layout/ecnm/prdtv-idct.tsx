import { createFileRoute } from "@tanstack/react-router";
import ProductivityIndicators from "~/pages/statistics/farmEconomy/ProductivityIndicators";

export const Route = createFileRoute("/bsc/_layout/ecnm/prdtv-idct")({
  component: RouteComponent,
});

// 농업 생산성지표
function RouteComponent() {
  return <ProductivityIndicators />;
}

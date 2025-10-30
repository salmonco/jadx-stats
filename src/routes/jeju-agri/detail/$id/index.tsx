import { createFileRoute, useParams } from "@tanstack/react-router";
import ReportDetail from "~/pages/JejuAgricultureInData/ReportDetail";

export const Route = createFileRoute("/jeju-agri/detail/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });

  return <ReportDetail id={id} />;
}

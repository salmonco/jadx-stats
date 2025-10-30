import { createFileRoute } from "@tanstack/react-router";
import JejuAgricultureInData from "../../pages/JejuAgricultureInData";
import { z } from "zod";

export const Route = createFileRoute("/jeju-agri/")({
  validateSearch: z.object({
    category: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { category } = Route.useSearch();

  return <JejuAgricultureInData category={category} />;
}

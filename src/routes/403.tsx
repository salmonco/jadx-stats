import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/403")({
  component: () => (
    <div className="mx-auto max-w-xl p-10 text-center">
      <h1 className="mb-2 text-2xl font-semibold">접근 권한이 없습니다</h1>
      <p className="text-gray-600">해당 페이지는 농협 또는 수급관리센터 전용입니다.</p>
    </div>
  ),
});

import { useNavigate } from "@tanstack/react-router";
import { BackTop, Tag } from "antd";
import { ArrowUp, ChevronLeft, Clock9 } from "lucide-react";
import { categoryIcons } from "./ReportList";
import reportConfig from "./reports/reportConfig";

const ReportDetail = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const report = reportConfig.find((report) => report.id === id);

  return (
    <div className="w-full bg-white">
      <div className="flex gap-2 bg-gradient-to-b from-[#1e3a8a] to-[#4061bb] text-white">
        <div className="relative mx-auto flex h-full w-full max-w-[1300px] gap-2 px-16 py-12 2xl:max-w-[1400px] 3xl:max-w-[1600px] 3xl:py-16 4xl:max-w-[1900px]">
          <ChevronLeft size={36} strokeWidth={1.25} className="mt-[-3px] cursor-pointer" onClick={() => navigate({ to: "/jeju-agri" })} />
          <div className="flex flex-col gap-3 px-1">
            <div className="text-3xl font-semibold">{report?.title}</div>
            <div className="text-xl">{report?.description}</div>
            <div className="mt-4 flex gap-2">
              <Tag className="rounded-full bg-white px-4 py-2">
                <div className="flex items-center gap-1.5 text-[16px]">
                  <Clock9 size={18} />
                  {report?.date}
                </div>
              </Tag>
              <Tag className="rounded-full bg-white px-4 py-2">
                <div className="flex items-center gap-1.5 text-[16px]">
                  {categoryIcons[report?.category as keyof typeof categoryIcons]({ size: 18 })}
                  {report?.category}
                </div>
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f1f6fd]">
        <div className="mx-auto flex h-full w-full max-w-[1300px] flex-col gap-2 px-16 py-12 2xl:max-w-[1400px] 3xl:max-w-[1600px] 3xl:py-14 4xl:max-w-[1900px]">
          <div className="min-h-[90vh] px-12">{report?.component && <report.component />}</div>
          <BackTop>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1e3a8a] shadow-lg">
              <ArrowUp size={24} />
            </div>
          </BackTop>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;

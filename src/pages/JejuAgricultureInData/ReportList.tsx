import { useNavigate } from "@tanstack/react-router";
import reportConfig from "~/pages/JejuAgricultureInData/reports/reportConfig";
import { Clock9, UsersRound, Banknote, Fence, Tractor, Citrus, Sprout, Package, Handshake, Salad } from "lucide-react";

export const categoryIcons = {
  농가인구: (props?: { size?: number; color?: string }) => <UsersRound size={props?.size || 16} color={props?.color} strokeWidth={1.5} />,
  농가경제: (props?: { size?: number; color?: string }) => <Banknote size={props?.size || 16} color={props?.color} strokeWidth={1.5} />,
  경지이용: (props?: { size?: number; color?: string }) => <Fence size={props?.size || 16} color={props?.color} strokeWidth={1.5} />,
  감귤: (props?: { size?: number; color?: string }) => <Citrus size={props?.size || 16} color={props?.color} strokeWidth={1.5} />,
  생산요소: (props?: { size?: number; color?: string }) => <Package size={props?.size || 16} color={props?.color} strokeWidth={1.5} />,
  농가경영: (props?: { size?: number; color?: string }) => <Handshake size={props?.size || 16} color={props?.color} strokeWidth={1.5} />,
  농업생산: (props?: { size?: number; color?: string }) => <Tractor size={props?.size || 16} color={props?.color} strokeWidth={1.5} />,
  토양: (props?: { size?: number; color?: string }) => <Sprout size={props?.size || 16} color={props?.color} strokeWidth={1.5} />,
  식품: (props?: { size?: number; color?: string }) => <Salad size={props?.size || 16} color={props?.color} strokeWidth={1.5} />,
};

interface props {
  searchValue: string;
  selectedCategory: string[];
}

const ReportList = ({ searchValue, selectedCategory }: props) => {
  const navigate = useNavigate();

  const filtered = reportConfig.filter((report) => {
    const matchesSearch =
      !searchValue || report.title.toLowerCase().includes(searchValue.toLowerCase()) || report.description.toLowerCase().includes(searchValue.toLowerCase());

    const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(report.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-3 gap-6 sm:grid-cols-2">
      {filtered.map((report) => (
        <div
          key={report.id}
          className="h-[180px] cursor-pointer rounded-md border border-gray-300 bg-white p-6 transition-all duration-200 hover:scale-[1.03] hover:shadow-md"
          onClick={() => navigate({ to: `/jeju-agri/detail/${report.id}` })}
        >
          <div className="flex gap-3">
            <div className="text-gray-600">{categoryIcons[report.category as keyof typeof categoryIcons]({ size: 36 })}</div>
            <div className="flex flex-col items-start gap-2">
              <h3 className="text-[18px] font-semibold leading-snug text-black">{report.title}</h3>
              <div className="flex flex-wrap items-center gap-2 text-[15px] text-gray-700">
                <div className="flex items-center gap-1">
                  <Clock9 size={14} />
                  {report.date}
                </div>
                <div className="flex items-center gap-1">
                  {categoryIcons[report.category as keyof typeof categoryIcons]({ size: 14 })}
                  {report.category}
                </div>
              </div>
              <p className="line-clamp-3 text-[15px] text-gray-700">{report.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;

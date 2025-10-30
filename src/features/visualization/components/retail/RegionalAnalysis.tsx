import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { PriceDashboardRegionResponse } from "~/services/types/visualizationTypes";
import RegionalCompositeChart from "~/features/visualization/components/retail/RegionalCompositeChart";
import RegionalPieChart from "~/features/visualization/components/retail/RegionalPieChart";
import RegionalTable from "~/features/visualization/components/retail/RegionalTable";
import { downloadExcel } from "~/utils/downloadExcel";
import { Button, Card, DatePicker, Radio, Select, Table } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { ChartNoAxesCombined, Table2, PieChart, MoveUp, MoveDown } from "lucide-react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

type ChartType = "composite" | "pie" | "table";

const rangeOptions = [
  { label: "최근 7일", value: "7" },
  { label: "최근 30일", value: "30" },
  { label: "최근 90일", value: "90" },
  { label: "올해", value: "year" },
  { label: "직접 설정", value: "custom" },
];

const getTopBottomRegions = (data: PriceDashboardRegionResponse | undefined) => {
  if (!data || !data.length) {
    return {
      top: [],
      bottom: [],
    };
  }

  // 모든 날짜의 권역별 평균 계산
  const regionAverages = data.reduce(
    (acc, dateData) => {
      dateData.data.forEach((item) => {
        if (item.average_price === null || item.average_weight === null) return;

        if (!acc[item.market_region_name]) {
          acc[item.market_region_name] = {
            totalPrice: 0,
            totalVolume: 0,
            count: 0,
          };
        }

        acc[item.market_region_name].totalPrice += item.average_price;
        acc[item.market_region_name].totalVolume += item.average_weight;
        acc[item.market_region_name].count += 1;
      });
      return acc;
    },
    {} as Record<string, { totalPrice: number; totalVolume: number; count: number }>
  );

  // 평균값 계산 및 정렬
  const sortedRegions = Object.entries(regionAverages)
    .map(([name, stats]) => ({
      name,
      price: stats.totalPrice / stats.count,
      import: stats.totalVolume / stats.count,
    }))
    .sort((a, b) => b.price - a.price);

  // 상위 3개 지역
  const topRegions = sortedRegions.slice(0, 3);
  const topRegionNames = new Set(topRegions.map((region) => region.name));

  // 하위 지역에서 상위 지역 제외
  const bottomCandidates = sortedRegions.filter((region) => !topRegionNames.has(region.name));
  const bottomRegions = bottomCandidates.slice(-3).reverse();

  return {
    top: topRegions.map((item, index) => ({
      rank: index + 1,
      name: item.name,
      price: item.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      import: item.import.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    })),
    bottom: bottomRegions.map((item, index) => ({
      rank: sortedRegions.length - bottomRegions.length + index + 1,
      name: item.name,
      price: item.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      import: item.import.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    })),
  };
};

const RegionalAnalysis = ({ pummok }: { pummok: string }) => {
  const today = dayjs();

  const [chartType, setChartType] = useState<ChartType>("composite");
  const [selectedRange, setSelectedRange] = useState("7");
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(today.subtract(6, "day"));
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(today);

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);

    if (value === "custom") return;

    if (value === "year") {
      setStartDate(dayjs().startOf("year"));
      setEndDate(today);
    } else {
      const days = parseInt(value);
      setStartDate(today.subtract(days - 1, "day"));
      setEndDate(today);
    }
  };

  const handlePickerChange = (dates: [dayjs.Dayjs, dayjs.Dayjs]) => {
    if (selectedRange === "custom" && dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    }
  };

  const { data } = useQuery<PriceDashboardRegionResponse>({
    queryKey: ["price-dashboard-region-data", pummok, selectedRange, startDate, endDate],
    queryFn: () =>
      visualizationApi.getPriceDashboardRegion({
        pummok: pummok,
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate.format("YYYY-MM-DD"),
      }),
    retry: false,
  });

  // 전체 데이터가 반입량(total_weight)이 763,745kg 만 오고 있음
  const { top: topRegions, bottom: bottomRegions } = getTopBottomRegions(data);

  const handleExcelDownload = () => {
    const params = { pummok: pummok, start_date: startDate.format("YYYY-MM-DD"), end_date: endDate.format("YYYY-MM-DD") };
    downloadExcel(visualizationApi.getPriceDashboardRegionExcel, params, "price_dashboard_region.xlsx");
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <Select value={selectedRange} onChange={handleRangeChange} options={rangeOptions} style={{ width: 120 }} />
          <RangePicker value={[startDate, endDate]} onChange={handlePickerChange} disabled={selectedRange !== "custom"} allowClear={false} />
        </div>
        <div className="flex items-center gap-[16px]">
          <Radio.Group value={chartType} onChange={(e) => setChartType(e.target.value as ChartType)} className="flex">
            <Radio.Button value="composite">
              <div className="flex items-center justify-center gap-[8px] text-[16px]">
                <ChartNoAxesCombined width={18} height={18} strokeWidth={1.75} />
                복합 차트
              </div>
            </Radio.Button>
            <Radio.Button value="pie">
              <div className="flex items-center justify-center gap-[8px] text-[16px]">
                <PieChart width={18} height={18} strokeWidth={1.75} />
                파이 차트
              </div>
            </Radio.Button>
            <Radio.Button value="table">
              <div className="flex items-center justify-center gap-[8px] text-[16px]">
                <Table2 width={18} height={18} strokeWidth={1.75} />
                테이블
              </div>
            </Radio.Button>
          </Radio.Group>
          <Button icon={<DownloadOutlined />} className="text-[16px]" onClick={handleExcelDownload} disabled={!data}>
            엑셀 다운로드
          </Button>
        </div>
      </div>
      <div className="flex gap-[16px]">
        <Card className={bottomRegions.length > 0 ? "flex-1" : "w-full"}>
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center gap-[4px]">
              <MoveUp width={16} height={16} strokeWidth={2.5} color="#16a349" />
              <span className="text-[18px] font-semibold">가격 상위 3개 권역 요약</span>
            </div>
            <Table
              size="small"
              pagination={false}
              dataSource={topRegions}
              columns={[
                {
                  title: "순위",
                  align: "center",
                  onHeaderCell: () => ({ style: { backgroundColor: "#effdf4" } }),
                  render: (_, __, index) => index + 1,
                },
                { dataIndex: "name", title: "권역", align: "center", onHeaderCell: () => ({ style: { backgroundColor: "#effdf4" } }) },
                { dataIndex: "price", title: "평균가 (원/kg)", align: "center", onHeaderCell: () => ({ style: { backgroundColor: "#effdf4" } }) },
                { dataIndex: "import", title: "반입량 (kg)", align: "center", onHeaderCell: () => ({ style: { backgroundColor: "#effdf4" } }) },
              ]}
            />
          </div>
        </Card>
        {bottomRegions.length > 0 && (
          <Card className="flex-1">
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[4px]">
                <MoveDown width={16} height={16} strokeWidth={2.5} color="#dc2625" />
                <span className="text-[18px] font-semibold">가격 하위 3개 권역 요약</span>
              </div>
              <Table
                size="small"
                pagination={false}
                dataSource={bottomRegions}
                columns={[
                  {
                    title: "순위",
                    align: "center",
                    onHeaderCell: () => ({ style: { backgroundColor: "#fef1f2" } }),
                    render: (_, __, index) => index + 1,
                  },
                  { dataIndex: "name", title: "권역", align: "center", onHeaderCell: () => ({ style: { backgroundColor: "#fef1f2" } }) },
                  { dataIndex: "price", title: "평균가 (원/kg)", align: "center", onHeaderCell: () => ({ style: { backgroundColor: "#fef1f2" } }) },
                  { dataIndex: "import", title: "반입량 (kg)", align: "center", onHeaderCell: () => ({ style: { backgroundColor: "#fef1f2" } }) },
                ]}
              />
            </div>
          </Card>
        )}
      </div>
      {chartType === "composite" ? <RegionalCompositeChart data={data} /> : chartType === "pie" ? <RegionalPieChart data={data} /> : <RegionalTable data={data} />}
    </>
  );
};

export default RegionalAnalysis;

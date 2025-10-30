import { useEffect, useState } from "react";
import { Table } from "antd";

// 주요 연도별 제주와 전국 비료소비량 비교 데이터
const comparisonData = [
  { key: "1975", year: 1975, jeju: 468, national: 396, ratio: 1.2 },
  { key: "1994", year: 1994, jeju: 1076, national: 399, ratio: 2.7 },
  { key: "2005", year: 2005, jeju: 599, national: 354, ratio: 1.7 },
  { key: "2010", year: 2010, jeju: 320, national: 219, ratio: 1.5 },
  { key: "2023", year: 2023, jeju: 414, national: 247, ratio: 1.7 },
];

// 테이블 컬럼 정의
const columns = [
  {
    title: "연도",
    dataIndex: "year",
    key: "year",
    align: "center" as const,
  },
  {
    title: "제주",
    dataIndex: "jeju",
    key: "jeju",
    align: "center" as const,
    render: (text: number) => `${text} kg/ha`,
  },
  {
    title: "전국",
    dataIndex: "national",
    key: "national",
    align: "center" as const,
    render: (text: number) => `${text} kg/ha`,
  },
  {
    title: "제주/전국",
    dataIndex: "ratio",
    key: "ratio",
    align: "center" as const,
    render: (text: number) => text.toFixed(1),
  },
];

export default function FertilizerComparisonTable() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Import Ant Design styles
    import("antd/dist/reset.css");
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table
        dataSource={comparisonData}
        columns={columns}
        pagination={false}
        size="small"
        bordered
        title={() => <div className="text-center font-medium">주요 연도별 제주와 전국 비료소비량 비교</div>}
      />
    </div>
  );
}

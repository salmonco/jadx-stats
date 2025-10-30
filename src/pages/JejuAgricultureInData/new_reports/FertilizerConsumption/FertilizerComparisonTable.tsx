import { Table } from "antd";

const columns = [
  {
    title: "연도",
    dataIndex: "year",
    key: "year",
    align: "center" as const,
    width: "20%",
  },
  {
    title: "제주",
    dataIndex: "jeju",
    key: "jeju",
    align: "center" as const,
    width: "25%",
  },
  {
    title: "전국",
    dataIndex: "national",
    key: "national",
    align: "center" as const,
    width: "25%",
  },
  {
    title: "제주/전국",
    dataIndex: "ratio",
    key: "ratio",
    align: "center" as const,
    width: "30%",
    render: (text: string) => `${text}배`,
  },
];

const data = [
  {
    key: "1",
    year: "1975",
    jeju: "468 kg/ha",
    national: "396 kg/ha",
    ratio: "1.2",
  },
  {
    key: "2",
    year: "1994",
    jeju: "1,076 kg/ha",
    national: "399 kg/ha",
    ratio: "2.7",
  },
  {
    key: "3",
    year: "2005",
    jeju: "599 kg/ha",
    national: "354 kg/ha",
    ratio: "1.7",
  },
  {
    key: "4",
    year: "2010",
    jeju: "320 kg/ha",
    national: "219 kg/ha",
    ratio: "1.5",
  },
  {
    key: "5",
    year: "2023",
    jeju: "414 kg/ha",
    national: "247 kg/ha",
    ratio: "1.7",
  },
];

export default function FertilizerComparisonTable() {
  return (
    <div className="p-6">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="middle"
        className="w-full"
        style={{
          backgroundColor: "white",
        }}
      />
    </div>
  );
}

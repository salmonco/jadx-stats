import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface DailyData {
  key: string;
  date: string;
  harvest?: number;
  storage?: number;
  shipment?: number;
  cultivationArea?: number;
  sowingAmount?: number;
}

const harvestColumns: ColumnsType<DailyData> = [
  {
    key: "hrvstYmd",
    title: "수확일자",
    dataIndex: "hrvstYmd",
    align: "center",
    width: "31%",
    render: (val: string) => dayjs(val).format("YYYY-MM-DD"),
  },
  {
    key: "totlHrvstVol",
    title: "수확량",
    dataIndex: "totlHrvstVol",
    align: "center",
    width: "23%",
    render: (val: number) => val?.toLocaleString() + "kg",
  },
  {
    key: "totlStrgVol",
    title: "저장량",
    dataIndex: "totlStrgVol",
    align: "center",
    width: "23%",
    render: (val: number) => val?.toLocaleString() + "kg",
  },
  {
    title: "출하량",
    dataIndex: "totlDptVol",
    align: "center",
    width: "23%",
    render: (val: number) => val?.toLocaleString() + "kg",
  },
];

const sowingColumns: ColumnsType<DailyData> = [
  {
    key: "actvYmd",
    title: "파종일자",
    dataIndex: "actvYmd",
    align: "center",
    width: "40%",
    render: (val: string) => dayjs(val).format("YYYY-MM-DD"),
  },
  {
    key: "totlCltvar",
    title: "재배면적",
    dataIndex: "totlCltvar",
    align: "center",
    width: "30%",
    render: (val: number) => (
      <>
        {val.toLocaleString()}m<sup>2</sup>
      </>
    ),
  },
  {
    key: "totlVol",
    title: "파종량",
    dataIndex: "totlVol",
    align: "center",
    width: "30%",
    render: (val: number) => val?.toLocaleString() + "kg",
  },
];

interface Props {
  region: string[];
  viewType: "SDNG" | "HRVST";
  dailyData: any;
}

const RegionDailyStatusTable = ({ region, viewType, dailyData }: Props) => {
  const columns = viewType === "HRVST" ? harvestColumns : sowingColumns;

  return (
    <div className="h-[370px] space-y-1 3xl:h-[500px] 4xl:h-[600px]">
      <p className="text-[19px] font-semibold">
        {region[0]} {region[1]} 일자별 {viewType === "SDNG" ? "파종" : "수확"} 현황
      </p>
      <Table columns={columns} dataSource={dailyData} pagination={false} className="cultivation-harvest-table" />
    </div>
  );
};

export default RegionDailyStatusTable;

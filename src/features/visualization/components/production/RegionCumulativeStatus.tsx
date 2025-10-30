import { useState } from "react";
import { Table } from "antd";
import type { TableColumnType } from "antd";
import dayjs from "dayjs";

interface Props {
  selectedDateRange: string[];
  viewType: "SDNG" | "HRVST";
  selectedRegion: string[];
  setSelectedRegion: (region: string[]) => void;
  totalData: any;
}

const RegionCumulativeStatus = ({ selectedDateRange, viewType, selectedRegion, setSelectedRegion, totalData }: Props) => {
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);

  const dataSource: any[] = [];

  const transformRiDataToRawData = (riData: any[]) => {
    const grouped: Record<string, any> = {};

    riData?.forEach((item) => {
      const region = item.emdNm || "기타";
      const detailName = item.stliNm;

      if (!grouped[region]) {
        grouped[region] = {
          details: [],
          regionTotal: {
            cultivationArea: 0,
            sowingAmount: 0,
            harvest: 0,
            storage: 0,
            shipment: 0,
          },
        };
      }

      // stliNm이 비어있으면 지역 총계에 추가
      if (!detailName || detailName.trim() === "") {
        grouped[region].regionTotal = {
          cultivationArea: item.totlCltvar ?? 0,
          sowingAmount: item.totlVol ?? 0,
          harvest: item.totlHrvstVol ?? 0,
          storage: item.totlStrgVol ?? 0,
          shipment: item.totlDptVol ?? 0,
        };
      } else {
        // stliNm이 있으면 상세에 추가
        grouped[region].details.push({
          name: detailName,
          cultivationArea: item.totlCltvar ?? 0,
          sowingAmount: item.totlVol ?? 0,
          harvest: item.totlHrvstVol ?? 0,
          storage: item.totlStrgVol ?? 0,
          shipment: item.totlDptVol ?? 0,
        });
      }
    });

    return Object.entries(grouped).map(([region, data]) => ({
      region,
      details: data.details,
      regionTotal: data.regionTotal,
    }));
  };

  const transformedData = transformRiDataToRawData(totalData);

  transformedData.forEach(({ region, details, regionTotal }) => {
    // details 합계 + regionTotal 합계
    const detailsSum = details.reduce(
      (acc, cur) => {
        acc.harvest += cur.harvest;
        acc.storage += cur.storage;
        acc.shipment += cur.shipment;
        acc.cultivationArea += cur.cultivationArea;
        acc.sowingAmount += cur.sowingAmount;
        return acc;
      },
      { harvest: 0, storage: 0, shipment: 0, cultivationArea: 0, sowingAmount: 0 }
    );

    const subtotal = {
      harvest: detailsSum.harvest + regionTotal.harvest,
      storage: detailsSum.storage + regionTotal.storage,
      shipment: detailsSum.shipment + regionTotal.shipment,
      cultivationArea: detailsSum.cultivationArea + regionTotal.cultivationArea,
      sowingAmount: detailsSum.sowingAmount + regionTotal.sowingAmount,
    };

    dataSource.push({
      key: region,
      region,
      name: "소계",
      harvest: subtotal.harvest,
      storage: subtotal.storage,
      shipment: subtotal.shipment,
      cultivationArea: subtotal.cultivationArea,
      sowingAmount: subtotal.sowingAmount,
      isSummary: true,
    });

    // 상세 지역
    if (expandedRegions.includes(region)) {
      details.forEach((detail) => {
        dataSource.push({
          key: `${region}${detail.name ? `-${detail.name}` : ""}`,
          region: null,
          ...detail,
        });
      });
    }
  });

  const commonColumns: TableColumnType<any>[] = [
    {
      title: "지역",
      dataIndex: "region",
      align: "center",
      render: (val: string | null, _, index: number) => {
        const isEmptyRegion = val === null;
        const nextRow = dataSource[index + 1];
        const hasNextRowWithNullRegion = nextRow?.region === null;
        const shouldApplyNoBorder = (val !== null && hasNextRowWithNullRegion) || isEmptyRegion;
        const shouldExcludeHover = isEmptyRegion;

        return {
          children: val ? <div className="font-semibold">{val}</div> : null,
          props: {
            className: [shouldApplyNoBorder ? "no-border" : "", shouldExcludeHover ? "exclude-hover" : ""].join(" "),
          },
        };
      },
    },
    { title: "상세", dataIndex: "name", align: "center" },
  ];

  const sowingColumns: TableColumnType<any>[] = [
    {
      title: "재배면적",
      dataIndex: "cultivationArea",
      align: "center",
      render: (val: number) => (
        <>
          {val.toLocaleString()}m<sup>2</sup>
        </>
      ),
    },
    {
      title: "파종량",
      dataIndex: "sowingAmount",
      align: "center",
      render: (val: number) => val.toLocaleString() + "kg",
    },
  ];

  const harvestColumns: TableColumnType<any>[] = [
    {
      title: "수확량",
      dataIndex: "harvest",
      align: "center",
      render: (val: number) => val.toLocaleString() + "kg",
    },
    {
      title: "저장량",
      dataIndex: "storage",
      align: "center",
      render: (val: number) => val.toLocaleString() + "kg",
    },
    {
      title: "출하량",
      dataIndex: "shipment",
      align: "center",
      render: (val: number) => val.toLocaleString() + "kg",
    },
  ];

  const columns = viewType === "HRVST" ? [...commonColumns, ...harvestColumns] : [...commonColumns, ...sowingColumns];

  const toggleRegion = (region: string) => {
    const hasDetails = transformedData.find((item) => item.region === region)?.details?.length > 0;
    if (!hasDetails) {
      setSelectedRegion([region]);
      return;
    }

    setExpandedRegions((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]));
  };

  const findParentEup = (riName: string) => {
    const parent = transformedData.find((eup) => eup.details.some((detail) => detail.name === riName));
    return parent ? parent.region : null;
  };

  return (
    <div className="h-[370px] space-y-1 3xl:h-[500px] 4xl:h-[600px]">
      <div className="flex items-end justify-between">
        <p className="text-[19px] font-semibold">지역별 {viewType === "SDNG" ? "파종" : "수확"} 현황</p>
        <p className="text-[15px] text-[#efefef]">
          ({dayjs(selectedDateRange[0]).format("YYYY-MM-DD")} ~ {dayjs(selectedDateRange[1]).format("YYYY-MM-DD")} 누적)
        </p>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        className="cultivation-harvest-table"
        rowClassName={(row) => {
          // 하위 상세 지역이 선택된 경우
          if (!row.isSummary && row.name === selectedRegion[1]) return "cursor-pointer selected-row";
          // 소계 행이 선택된 경우 (하위 지역이 없는 경우)
          if (row.isSummary && row.region === selectedRegion[0] && !selectedRegion[1]) return "cursor-pointer selected-row";

          return "cursor-pointer";
        }}
        onRow={(row) => ({
          onClick: () => {
            if (row.isSummary) toggleRegion(row.region);
            else {
              const parentEup = findParentEup(row.name);
              if (parentEup) setSelectedRegion([parentEup, row.name]);
            }
          },
        })}
      />
    </div>
  );
};

export default RegionCumulativeStatus;

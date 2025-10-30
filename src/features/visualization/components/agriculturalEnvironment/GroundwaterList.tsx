import React, { SetStateAction, useEffect, useState } from "react";
import { GroundwaterData } from "~/pages/visualization/agricultureEnvironment/RegionNitrateNitrogen";
import { MetricsBarChart, MetricsTimeSeriesChart } from "~/features/visualization/components/agriculturalEnvironment/MetricsChart";
import Placeholder from "~/components/Placeholder";
import { jejuTownList, seogwipoTownList } from "~/utils/townList";
import { Button, Input, List, Progress, Select, Spin } from "antd";
import { GetProps } from "antd/lib";
import { LoadingOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

interface GroundwaterListProps {
  groundwaterData: GroundwaterData[];
  selectedSite: GroundwaterData;
  setSelectedSite: React.Dispatch<SetStateAction<GroundwaterData>>;
  isLoading: boolean;
}

const getProgressProps = (percentage: number) => {
  if (percentage === 100) {
    return {
      status: "success" as "success",
    };
  } else if (percentage === 0) {
    return {
      status: "exception" as "exception",
    };
  } else {
    return {
      strokeColor: percentage === 33 ? "#F57C00" : "#FBC02D",
      format: () => "",
    };
  }
};

const GroundwaterList = ({ groundwaterData, selectedSite, setSelectedSite, isLoading }: GroundwaterListProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState<GroundwaterData[]>([]);

  const [selectedSi, setSelectedSi] = useState<string | undefined>(undefined);
  const [selectedEmd, setSelectedEmd] = useState<string | undefined>(undefined);
  const [selectedRi, setSelectedRi] = useState<string | undefined>(undefined);

  useEffect(() => {
    setFilteredData(groundwaterData);
  }, [groundwaterData]);

  useEffect(() => {
    if (!selectedSite && groundwaterData.length > 0) {
      setSelectedSite(groundwaterData[0]);
    }
  }, [selectedSite, groundwaterData]);

  const onSearch: SearchProps["onSearch"] = (value) => {
    const lowerCaseValue = value.toLowerCase();

    const filtered = groundwaterData.filter((item) => {
      const addrLower = item.addr.toLowerCase();

      // 필수 조건: 시 (selectedSi)
      const isSiMatch = selectedSi ? addrLower.includes(selectedSi.toLowerCase()) : false;

      // 선택 조건: 읍면동, 리
      const isEmdMatch = selectedEmd ? addrLower.includes(selectedEmd.toLowerCase()) : true;
      const isRiMatch = selectedRi ? addrLower.includes(selectedRi.toLowerCase()) : true;

      // 검색어 (지번 등) 포함 여부
      const isSearchMatch = lowerCaseValue ? addrLower.includes(lowerCaseValue) : true;

      return isSiMatch && isEmdMatch && isRiMatch && isSearchMatch;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setFilteredData(groundwaterData);
    setSearchValue("");
  };

  const getEmdOptions = () => {
    if (selectedSi === "제주시") {
      return Object.keys(jejuTownList.제주시);
    } else if (selectedSi === "서귀포시") {
      return Object.keys(seogwipoTownList.서귀포시);
    }
    return [];
  };

  const getRiOptions = () => {
    if (selectedSi === "제주시" && selectedEmd) {
      return jejuTownList.제주시[selectedEmd] || [];
    } else if (selectedSi === "서귀포시" && selectedEmd) {
      return seogwipoTownList.서귀포시[selectedEmd] || [];
    }
    return [];
  };

  return (
    <div className="flex w-full flex-col gap-[14px] rounded-lg bg-[#43506E] pb-5 shadow">
      <div className="custom-search-bar flex h-[40px] items-center justify-end gap-2 p-4 pt-8">
        {/* <RegionDropdownSelector setSelectedRegion={setSelectedRegion} /> */}

        <Select
          allowClear
          className="w-[150px]"
          onChange={(value) => setSelectedSi(value)}
          value={selectedSi}
          placeholder={selectedSi === undefined ? "시 선택" : selectedSi}
        >
          <Select.Option value="제주시">제주시</Select.Option>
          <Select.Option value="서귀포시">서귀포시</Select.Option>
        </Select>

        <Select
          allowClear
          className="w-[150px]"
          onChange={(value) => setSelectedEmd(value)}
          value={selectedEmd}
          placeholder={selectedEmd === undefined ? "읍면동 선택" : selectedEmd}
          disabled={!selectedSi || getEmdOptions().length === 0}
        >
          {getEmdOptions().map((emd) => (
            <Select.Option key={emd} value={emd}>
              {emd}
            </Select.Option>
          ))}
        </Select>

        <Select
          allowClear
          className="w-[150px]"
          onChange={(value) => setSelectedRi(value)}
          value={selectedRi}
          placeholder={selectedRi === undefined ? "리 선택" : selectedRi}
          disabled={!selectedEmd || getRiOptions().length === 0}
        >
          {getRiOptions().map((emd) => (
            <Select.Option key={emd} value={emd}>
              {emd}
            </Select.Option>
          ))}
        </Select>

        <Search
          placeholder="지번 입력"
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={onSearch}
          className="w-[150px]"
          enterButton={<Button icon={<SearchOutlined />} />}
        />
        <Button icon={<RedoOutlined style={{ color: "#8c8c8c", fontSize: "15px" }} />} onClick={handleReset} disabled={!searchValue} />
      </div>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 140, color: "#ACB1BC" }} spin />} />
        </div>
      ) : filteredData.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={filteredData}
          pagination={{
            pageSize: 4,
            showSizeChanger: false,
            className: "custom-pagination",
          }}
          renderItem={(item) => {
            const isSelected = selectedSite && selectedSite.bplc_nm === item.bplc_nm;
            const percentage = Math.floor((item.qlty_scr / 3) * 100);

            return (
              <List.Item
                className={`cursor-pointer rounded-md transition duration-300 ease-in-out ${isSelected ? "bg-[#42597b] shadow-md" : "hover:bg-[#486185]"}`}
                onClick={() => setSelectedSite(item)}
              >
                <div className="flex w-full items-center justify-around pb-2 pl-4 text-white">
                  <div className="flex w-[30%]">
                    <div className="font-sans-kr w-[80%] p-1 text-[16px]">
                      <p>
                        {item.bplc_nm} ({item.prmsn_no})
                      </p>
                      <p>{item.addr}</p>
                    </div>
                    <Progress percent={percentage} type="circle" {...getProgressProps(percentage)} strokeWidth={9} size={50} />
                  </div>
                  <div className="w-[35%]">
                    <MetricsBarChart data={item} />
                  </div>
                  <div className="w-[35%]">
                    <MetricsTimeSeriesChart data={item} />
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-[16px]">
          <Placeholder content="검색 결과가 없습니다." bgColor="bg-[#505F7C]" />
        </div>
      )}
    </div>
  );
};

export default GroundwaterList;

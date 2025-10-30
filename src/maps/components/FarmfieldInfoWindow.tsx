import { useEffect, useState } from "react";
import FarmhouseDataService from "~/maps/services/FarmhouseDataService";
import { Feature } from "ol";
import { CloseOutlined, LoadingOutlined, LinkOutlined } from "@ant-design/icons";
import { Spin } from "antd";

interface Props {
  selectedFeature: Feature;
  setSelectedFeature: (feature: Feature) => void;
}

interface FarmfieldBaseInfo {
  aply_agrmen_no: string;
  area: number;
  farmfield_plots: Array<{
    koc_dclsf_nm: string;
    ltlnd_unq_no: string;
  }>;
  korn_flnm: string;
  rprs_ltlnd_unq_no: string;
  rprs_lotno_addr: string;
}

const FarmfieldInfoWindow = ({ selectedFeature, setSelectedFeature }: Props) => {
  const farmhouseDataService = new FarmhouseDataService();
  const [farmfieldBaseInfo, setFarmfieldBaseInfo] = useState<FarmfieldBaseInfo>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fid = selectedFeature?.getProperties()["ltlnd_mst_uid"];

  useEffect(() => {
    if (!selectedFeature?.getProperties()["ltlnd_mst_uid"]) return;
    const fetchFarmfieldBaseInfo = async () => {
      try {
        setIsLoading(true);

        const data = await farmhouseDataService.fetchFarmfieldBaseInfo(fid, false);

        setFarmfieldBaseInfo(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmfieldBaseInfo();
  }, [selectedFeature]);

  return (
    <>
      {selectedFeature?.getProperties()["ltlnd_mst_uid"] && (
        <div className="absolute right-[75px] top-[200px] h-[432px] w-[237px] divide-y divide-gray-400 rounded-md border border-gray-200 bg-white px-[16px] py-[16px] pr-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center pb-[6px]">
              <p className="text-[18px] font-semibold text-gray-900">농가 정보</p>
            </div>
            <div className="flex gap-[6px] pb-[16px]">
              <LinkOutlined className="cursor-pointer text-gray-700" />
              <CloseOutlined className="cursor-pointer text-gray-700" onClick={() => setSelectedFeature(null)} />
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-[350px] items-center justify-center">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 88 }} spin />} />
            </div>
          ) : (
            <div className="pt-[12px]">
              <div className="max-h-[350px] space-y-[18px] overflow-y-auto text-[16px]">
                {/* 농가명 -> 8/19 숨김처리 요청 */}
                {/* <div className="flex flex-col">
                  <p className="text-gray-700">농가명</p>
                  <p className="font-semibold text-gray-800">{farmfieldBaseInfo?.korn_flnm ?? "-"}</p>
                </div> */}

                <div className="flex flex-col">
                  <p className="text-gray-700">농지 주소</p>
                  <p className="break-words break-keep font-semibold text-gray-800">{farmfieldBaseInfo?.rprs_lotno_addr ?? "-"}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-gray-700">농지 면적</p>
                  <p className="font-semibold text-gray-800">{farmfieldBaseInfo?.area ? `${farmfieldBaseInfo?.area.toLocaleString()} ㎡` : "-"}</p>
                </div>

                {/* 경영체 등록번호 -> 8/19 숨김처리 요청 */}
                {/* <div className="flex flex-col">
                  <p className="text-gray-700">경영체 등록번호</p>
                  <p className="font-semibold text-gray-800">{farmfieldBaseInfo?.aply_agrmen_no ?? "-"}</p>
                </div> */}

                <div className="flex flex-col">
                  <p className="text-gray-700">대표필지 PNU 코드</p>
                  <p className="font-semibold text-gray-800">{farmfieldBaseInfo?.rprs_ltlnd_unq_no ?? "-"}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-gray-700">농지마스터 UID</p>
                  <p className="font-semibold text-gray-800">{fid ?? "-"}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-gray-700">품목</p>
                  <p className="font-semibold text-gray-800">{[...new Set(farmfieldBaseInfo?.farmfield_plots?.map((plot) => plot.koc_dclsf_nm))].join(", ")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FarmfieldInfoWindow;

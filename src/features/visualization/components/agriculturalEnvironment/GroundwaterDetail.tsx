import { GroundwaterData } from "~/pages/visualization/agricultureEnvironment/RegionNitrateNitrogen";
import MiniMap, { usePointLayer } from "~/maps/components/MiniMap";
import { Descriptions } from "antd";

interface GroundwaterDetailProps {
  selectedSite: GroundwaterData;
}

const GroundwaterDetail = ({ selectedSite }: GroundwaterDetailProps) => {
  const pointLayer = usePointLayer([selectedSite?.lon, selectedSite?.lat]);

  return (
    <div className="flex w-full flex-col gap-8 rounded-lg bg-[#43506E] px-[12px] py-6 shadow">
      {selectedSite && (
        <>
          <MiniMap layers={[pointLayer]} />
          <div className="pl-1">
            <p className="pb-1 text-[18px] font-bold text-white">
              {selectedSite.bplc_nm} ({selectedSite.prmsn_no})
            </p>
            <p className="text-white">{selectedSite.addr}</p>
          </div>

          <Descriptions
            bordered
            column={1}
            size="default"
            labelStyle={{
              width: "130px",
              fontWeight: "600",
              fontSize: "15px",
              color: "white",
              backgroundColor: "#42597b",
              border: "1px solid #7b899c",
              borderRadius: "5px",
            }}
            contentStyle={{
              color: "white",
              backgroundColor: "#505f7d",
              border: "1px solid #7b899c",
            }}
          >
            <Descriptions.Item label="토출관구경">{selectedSite.pipe_sz}</Descriptions.Item>
            <Descriptions.Item label="수질검사기준">{selectedSite.wtrqlty_insp_crtr}</Descriptions.Item>
            <Descriptions.Item label="공공_사설">{selectedSite.pblc_ngov}</Descriptions.Item>
            <Descriptions.Item label="취수허가량">{selectedSite.wtrit_prmsn_qty.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="표고">{selectedSite.elev}</Descriptions.Item>
            <Descriptions.Item label="양수능력">{selectedSite.pwtr_ablt.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="사용용도">{selectedSite.dtl_usg}</Descriptions.Item>
          </Descriptions>
        </>
      )}
    </div>
  );
};

export default GroundwaterDetail;

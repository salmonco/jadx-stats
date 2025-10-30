import { useEffect, useState } from "react";
import visualizationApi from "~/services/apis/visualizationApi";
import RegionMetricsRange from "~/features/visualization/components/agriculturalEnvironment/RegionMetricsRange";
import GroundwaterList from "~/features/visualization/components/agriculturalEnvironment/GroundwaterList";
import GroundwaterDetail from "~/features/visualization/components/agriculturalEnvironment/GroundwaterDetail";
import { Metrics } from "~/features/visualization/components/agriculturalEnvironment/GroundwaterMetrics";

export interface HistoricalData {
  dt: string;
  vl: number;
  elem: Metrics;
}

export interface GroundwaterData {
  addr: string;
  pwtr_ablt: number;
  elev: number;
  dsctn: HistoricalData[];
  lon: number;
  lat: number;
  pipe_sz: number;
  wtrit_prmsn_qty: number;
  prmsn_dt: string;
  prmsn_no: string;
  pblc_ngov: string;
  qlty_scr: number;
  wtrqlty_insp_crtr: string;
  bplc_nm: string;
  dtl_usg: string;
}

const RegionNitrateNitrogen = () => {
  const [selectedSite, setSelectedSite] = useState<GroundwaterData>();
  const [groundwaterData, setGroundwaterData] = useState<GroundwaterData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGroundwaterData = async () => {
      try {
        setIsLoading(true);
        const response = await visualizationApi.getVisualizationData("agrclt_gwt_wtrqlty.file.well", { level: "well" });
        const data = response as GroundwaterData[];
        setGroundwaterData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroundwaterData();
  }, []);

  return (
    <div className="h-full w-full p-5">
      <div className="flex flex-col gap-5 rounded-lg bg-[#37445E] p-5">
        <div className="flex items-center gap-6 rounded-lg bg-[#43516D] px-5 py-4">
          <p className="text-2xl font-semibold text-white">관정별 지하수 분석 대시보드</p>
        </div>
        <div className="grid h-auto min-h-[868px] grid-cols-[2fr,5fr] gap-5">
          <GroundwaterDetail selectedSite={selectedSite} />
          <GroundwaterList groundwaterData={groundwaterData} selectedSite={selectedSite} setSelectedSite={setSelectedSite} isLoading={isLoading} />
        </div>
        <div className="grid h-72 grid-cols-3 gap-5">
          <RegionMetricsRange element="nitrogen" />
          <RegionMetricsRange element="chlorine" />
          <RegionMetricsRange element="ph" />
        </div>
      </div>
    </div>
  );
};

export default RegionNitrateNitrogen;

import { AgingStatusFeature } from "~/features/visualization/layers/AgingStatusLayer";
import { AgingChartData } from "~/maps/components/agingStatus/AgingStatusChart";

const transformToChartData = (features: AgingStatusFeature[]): AgingChartData[] => {
  const data = features
    .map((f): AgingChartData => {
      const p = f.properties;
      return {
        region: `${p.vrbs_nm} (${p.id})`,
        label: p.vrbs_nm,
        avg_age: p?.stats?.avg_age,
        count: p?.stats?.count,
      };
    })
    .filter((d) => typeof d.avg_age === "number" && !isNaN(d.avg_age));

  return data.sort((a, b) => (b.avg_age ?? 0) - (a.avg_age ?? 0));
};

export default transformToChartData;

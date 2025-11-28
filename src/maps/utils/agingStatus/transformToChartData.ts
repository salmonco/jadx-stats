import { AgingStatusFeature } from "~/features/visualization/layers/AgingStatusLayer";
import { AgingChartData } from "~/maps/components/agingStatus/AgingStatusChart";

const transformToChartData = (features: AgingStatusFeature[]): AgingChartData[] => {
  const regionMap = new Map<string, { totalAge: number; totalCount: number; count: number }>();

  /**
   * 같은 지역의 데이터를 집계
   * - FIXME: API에서 같은 지역명을 가진 feature가 여러 개 오는 문제
   */
  features.forEach((f) => {
    const p = f.properties;
    const region = p.vrbs_nm;
    const avgAge = p?.stats?.avg_age;
    const count = p?.stats?.count;

    if (typeof avgAge === "number" && !isNaN(avgAge) && typeof count === "number") {
      if (!regionMap.has(region)) {
        regionMap.set(region, { totalAge: 0, totalCount: 0, count: 0 });
      }
      const existing = regionMap.get(region)!;
      existing.totalAge += avgAge * count;
      existing.totalCount += count;
      existing.count += 1;
    }
  });

  // 집계된 데이터를 차트 데이터로 변환
  const data: AgingChartData[] = Array.from(regionMap.entries()).map(([region, stats]) => ({
    region,
    label: region,
    avg_age: stats.totalAge / stats.totalCount,
    count: stats.totalCount,
  }));

  return data.sort((a, b) => (b.avg_age ?? 0) - (a.avg_age ?? 0));
};

export default transformToChartData;

import { useEffect, useState } from "react";
import statsApi from "~/services/apis/statsApi";
import { StatsRange } from "~/services/types/statsTypes";

const useFetchStatsRange = (qualifiedName: string) => {
  const [range, setRange] = useState<StatsRange>();

  useEffect(() => {
    const fetchRange = async () => {
      const result = await statsApi.getStatsRange(qualifiedName);
      setRange(result);
    };

    fetchRange();
  }, [qualifiedName]);

  return range;
};

export default useFetchStatsRange;

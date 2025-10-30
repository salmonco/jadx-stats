import { useEffect, useState } from "react";
import statsApi from "~/services/apis/statsApi";

const useFetchStatsData = (qualifiedName: string, startYear: number, endYear: number) => {
  const [statsData, setStatsData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await statsApi.getStatsData(qualifiedName, startYear, endYear);
      setStatsData(result);
    };
    fetchData();
  }, [qualifiedName, startYear, endYear]);

  return statsData;
};

export default useFetchStatsData;

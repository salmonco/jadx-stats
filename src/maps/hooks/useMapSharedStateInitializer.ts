import { useEffect } from "react";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";

interface Params {
  mapList: BackgroundMapList;
}

const useMapSharedStateInitializer = ({ mapList }: Params) => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const config = params.get("config");
    if (!config) {
      return;
    }

    try {
      const jsonState = decodeURIComponent(atob(config));
      const state = JSON.parse(jsonState);
      mapList.initSharedState(state);
    } catch (error) {
      console.error("공유 상태 초기화 중 오류가 발생했습니다.", error);
    }
  }, []);
};

export default useMapSharedStateInitializer;

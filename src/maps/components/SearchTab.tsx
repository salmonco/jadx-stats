import React, { useCallback, useRef, useState } from "react";
import { Input, Button, Radio, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";
import FarmhouseDataService from "../services/FarmhouseDataService";
import { Farmhouse, FarmhouseSearhResult } from "../classes/interfaces";
import { MultiPolygon } from "ol/geom";
import { Feature } from "ol";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import BaseLayer from "~/maps/layers/BaseLayer";
import { getCenter } from "ol/extent";

interface SearchTabProps {
  layerManager: LayerManager;
  map: ExtendedOLMap;
}

const SearchTab: React.FC<SearchTabProps> = ({ layerManager, map }) => {
  const farmhouseDataService = new FarmhouseDataService();

  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResult, setSearchResult] = useState<FarmhouseSearhResult[]>([]);
  const [selectedFarmhouse, setSelectedFarmhouse] = useState<FarmhouseSearhResult | null>(null);
  const [offset, setOffset] = useState<number>(1);

  // 인피니티 스크롤링
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [searchResult, offset]
  );

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextOffset = offset + 15;
      const moreResults = await farmhouseDataService.getFarmhousesFarmFields(searchValue, nextOffset, 15);

      setSearchResult((prev) => [...prev, ...moreResults]);
      setOffset(nextOffset);
      setHasMore(moreResults.length === 15);
    } catch (err) {
      console.error("더 불러오기 실패", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    try {
      setOffset(1); // 먼저 초기화
      const result = await farmhouseDataService.getFarmhousesFarmFields(searchValue, 1, 15);
      setSearchResult(result);
      setHasMore(result.length === 15); // 15개 미만이면 더 없음
    } catch (error) {
      console.error(error);
      setHasMore(false);
    }
  };

  const handleFarmhouseSelection = useCallback(
    async (farmhouse: FarmhouseSearhResult) => {
      setSelectedFarmhouse(farmhouse);
      const farmhouseData: Farmhouse = await farmhouseDataService.fetchFarmfieldBaseInfo(farmhouse.ltlnd_mst_uid, true);

      const coords = farmhouseData.auto_geom?.coordinates;

      if (coords?.length > 0 && layerManager && map) {
        const multiPolygon = new MultiPolygon(coords);
        const feature = new Feature({
          geometry: multiPolygon,
          ltlnd_mst_uid: farmhouse.ltlnd_mst_uid,
        });

        const vectorSource = new VectorSource({ features: [feature] });

        const vectorStyle = new Style({
          fill: new Fill({ color: "rgba(255, 100, 190, 0.3)" }),
          stroke: new Stroke({ color: "rgba(255, 100, 190, 1)", width: 2 }),
        });

        const layer = new BaseLayer(
          {
            layerType: "vector",
            source: vectorSource,
            style: vectorStyle,
          },
          "농업 주소 조회 레이어"
        );

        layerManager.addLayer(layer, "농업 주소 조회 레이어");

        const extent = multiPolygon.getExtent();
        const center = getCenter(extent);
        map.getView().animate({
          center,
          zoom: 17,
          duration: 500,
        });
      }
    },
    [farmhouseDataService, layerManager, map]
  );

  return (
    <div className="flex h-full flex-col gap-[12px] overflow-hidden">
      <p className="text-[20px] font-semibold">제주 농업 주소 조회</p>
      <div className="flex gap-2">
        <Input
          placeholder="주소를 입력하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-[36px]"
        />
        <Button type="primary" className="h-[36px] w-[40px] text-[20px]" onClick={() => handleSearch()}>
          <SearchOutlined />
        </Button>
      </div>
      {searchResult && (
        <div className="flex min-h-0 flex-col gap-2 overflow-y-auto rounded-lg border border-[#d9d9d9]">
          <Radio.Group value={selectedFarmhouse}>
            <List
              dataSource={searchResult}
              renderItem={(item, index) => {
                let address = item?.lotno_addr || item?.rprs_lotno_addr;
                if (address) address = address.replace(/^제주특별자치도\s*/, "").trim();

                const isLast = index === searchResult.length - 1;

                return (
                  <List.Item ref={isLast ? lastItemRef : null}>
                    <div className="flex gap-3 px-[24px] text-[15px]">
                      <Radio value={item} onChange={() => handleFarmhouseSelection(item)} />
                      <div>{address}</div>
                    </div>
                  </List.Item>
                );
              }}
            />
          </Radio.Group>
        </div>
      )}
    </div>
  );
};

export default SearchTab;

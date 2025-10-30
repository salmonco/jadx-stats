import React, { memo, SetStateAction, useState } from "react";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";
import SearchTab from "~/maps/components/SearchTab";
import FilterLayerTab from "~/maps/components/FilterLayerTab";
import BasicLayerTab from "~/maps/components/BasicLayerTab";
import { Drawer, Button, Segmented } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Map, SlidersHorizontal, Layers2 } from "lucide-react";

interface LayerControlDrawerProps {
  layerManager: LayerManager;
  map: ExtendedOLMap;
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
  layersTrigger: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

const LayerControlDrawer = memo(({ layerManager, map, toggleDrawer, isDrawerOpen, layersTrigger, setLoading }: LayerControlDrawerProps) => {
  const [selectedTab, setSelectedTab] = useState<"search" | "filter" | "layer">("search");
  const tabOptions = [
    { label: "주소 검색", value: "search" },
    { label: "필터", value: "filter" },
    { label: "레이어", value: "layer" },
  ];

  return (
    <>
      {!isDrawerOpen && (
        <div className="drawer-open-handle">
          <div
            onClick={() => {
              toggleDrawer();
              setSelectedTab("search");
            }}
          >
            <Map strokeWidth={1.5} className="h-[26px] w-[26px]" />
            주소 검색
          </div>
          <div
            onClick={() => {
              toggleDrawer();
              setSelectedTab("filter");
            }}
          >
            <SlidersHorizontal strokeWidth={1.75} className="h-[26px] w-[26px]" />
            필터
          </div>
          <div
            onClick={() => {
              toggleDrawer();
              setSelectedTab("layer");
            }}
          >
            <Layers2 strokeWidth={1.75} className="h-[26px] w-[26px]" />
            레이어
          </div>
        </div>
      )}

      <Drawer
        title={null}
        placement="left"
        closable
        onClose={toggleDrawer}
        open={isDrawerOpen}
        mask={false}
        maskClosable={false}
        style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
        styles={{
          body: {
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          },
        }}
        getContainer={false}
        className="gis-drawer"
      >
        {isDrawerOpen && (
          <Button type="default" onClick={toggleDrawer} className="drawer-close-handle">
            <CloseOutlined />
          </Button>
        )}

        <div className="flex h-full flex-col gap-3 p-2">
          <Segmented options={tabOptions} block onChange={(value) => setSelectedTab(value as "search" | "filter" | "layer")} value={selectedTab} />
          {selectedTab === "search" && (
            <div className="min-h-0 flex-1">
              <SearchTab layerManager={layerManager} map={map} />
            </div>
          )}
          {selectedTab === "filter" && (
            <div className="min-h-0 flex-1">
              <FilterLayerTab layerManager={layerManager} setLoading={setLoading} />
            </div>
          )}
          {selectedTab === "layer" && (
            <div className="min-h-0 flex-1">
              <BasicLayerTab layerManager={layerManager} setLoading={setLoading} layersTrigger={layersTrigger} />
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
});

export default LayerControlDrawer;

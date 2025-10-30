import React, { SetStateAction } from "react";
import { Dropdown, Button, MenuProps } from "antd";
import { UpOutlined } from "@ant-design/icons";

export type BgMapType = "Satellite" | "Base" | "white" | "midnight" | "Terrain" | "world";

interface MapTypeSwitcherProps {
  mapType: BgMapType;
  setMapType: React.Dispatch<SetStateAction<BgMapType>>;
}

const MapTypeSwitcher = ({ mapType, setMapType }: MapTypeSwitcherProps) => {
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setMapType(e.key as BgMapType);
  };

  const allTypes: MenuProps["items"] = [
    { label: "위성", key: "Satellite" },
    { label: "기본", key: "Base" },
    { label: "백지도", key: "white" },
    { label: "자정", key: "midnight" },
    // { label: "지형도", key: "Terrain" },
    // { label: "세계지도", key: "world" },
  ];

  const items = allTypes.filter((item) => item.key !== mapType);
  const selectedItems = allTypes.find((item) => item.key === mapType);
  const label = selectedItems && "label" in selectedItems ? selectedItems.label : "";

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }} className="absolute bottom-3 right-3 flex transform gap-[15px]">
      <Button className="bg-white">
        {label} <UpOutlined />
      </Button>
    </Dropdown>
  );
};

export default MapTypeSwitcher;

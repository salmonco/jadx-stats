import { UpOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import React, { SetStateAction } from "react";
import { BackgroundMapType, BackgroundMapTypeMenuItems } from "~/maps/constants/backgroundMapType";

interface MapTypeSwitcherProps {
  mapType: BackgroundMapType;
  setMapType: React.Dispatch<SetStateAction<BackgroundMapType>>;
}

const MapTypeSwitcher = ({ mapType, setMapType }: MapTypeSwitcherProps) => {
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setMapType(e.key as BackgroundMapType);
  };

  const items = BackgroundMapTypeMenuItems.filter((item) => item.key !== mapType);
  const selectedItems = BackgroundMapTypeMenuItems.find((item) => item.key === mapType);
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

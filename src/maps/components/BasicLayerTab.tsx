import React, { useEffect, useMemo, useState } from "react";
import { useBasicLayerControl } from "~/maps/hooks/useBasicLayerControl";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { LAYER_CATEGORIES, LayerItem } from "~/maps/constants/basicLayerCategories";
import { Input, Button, Checkbox, List, Collapse, ColorPicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

interface LayerTabProps {
  layerManager: LayerManager;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  layersTrigger: boolean;
}

const BasicLayerTab = ({ layerManager, setLoading, layersTrigger }: LayerTabProps) => {
  const { layers, selectedLayers, handleLayerSelection, updateLayerColor } = useBasicLayerControl(layerManager, setLoading, layersTrigger);

  const [activeKeys, setActiveKeys] = useState<string[]>(["행정 및 계획지역"]);
  const [searchLayers, setSearchLayers] = useState<string>("");

  const { grouped, autoOpenKeys } = useMemo(() => {
    const g: Record<string, Record<string, LayerItem[]>> = {};
    const openKeys = new Set<string>();

    layers.forEach((layer) => {
      const cat = LAYER_CATEGORIES.find((c) => c.subCats.some((sc) => sc.match(layer)));
      if (!cat) return;

      const sub = cat.subCats.find((sc) => sc.match(layer))!;
      g[cat.catLabel] ??= {};
      g[cat.catLabel][sub.label] ??= [];
      g[cat.catLabel][sub.label].push(layer);
    });

    // 검색어 필터
    if (searchLayers) {
      Object.keys(g).forEach((catKey) => {
        Object.keys(g[catKey]).forEach((subKey) => {
          g[catKey][subKey] = g[catKey][subKey].filter((l) => l.title.includes(searchLayers));
          if (g[catKey][subKey].length === 0) delete g[catKey][subKey];
        });
        if (Object.keys(g[catKey]).length === 0) {
          delete g[catKey];
        } else {
          openKeys.add(catKey); // 검색 결과가 남아있는 대분류만 열기 대상
        }
      });
    }

    return { grouped: g, autoOpenKeys: Array.from(openKeys) };
  }, [layers, searchLayers]);

  useEffect(() => {
    if (searchLayers) {
      setActiveKeys(autoOpenKeys);
    } else {
      setActiveKeys(["행정 및 계획지역"]);
    }
  }, [autoOpenKeys, searchLayers]);

  return (
    <div className="flex h-full flex-col gap-[12px] overflow-hidden">
      <p className="text-[20px] font-semibold">레이어 선택</p>
      <div className="flex gap-2">
        <Input placeholder="레이어 검색" onChange={(e) => setSearchLayers(e.target.value)} />
        <Button type="primary" className="h-[36px] w-[40px] text-[20px]" onClick={() => setSearchLayers(searchLayers.trim())}>
          <SearchOutlined />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Collapse
          expandIconPosition="end"
          activeKey={activeKeys}
          onChange={(keys) => {
            const arr = Array.isArray(keys) ? keys : [keys];
            setActiveKeys(arr);
          }}
          className="mr-[8px] text-[16px]"
        >
          {LAYER_CATEGORIES.map(({ catLabel, subCats }) => {
            const subObj = grouped[catLabel];
            if (!subObj) return null;

            return (
              <Panel header={catLabel} key={catLabel} className="basic-layer-panel">
                {subCats.map(({ label: subLabel }) => {
                  const subLayers = subObj[subLabel];
                  if (!subLayers) return null;

                  return (
                    <List
                      key={subLabel}
                      dataSource={subLayers}
                      renderItem={(item) => {
                        const checked = selectedLayers.some((l) => l.title === item.title);
                        return (
                          <List.Item>
                            <div className="flex w-full justify-between">
                              <Checkbox checked={checked} onChange={() => handleLayerSelection(item)}>
                                {subLabel}
                              </Checkbox>

                              {checked && (
                                <ColorPicker
                                  size="small"
                                  defaultValue={"#0000FF"}
                                  disabledAlpha={true}
                                  onChangeComplete={(c) => {
                                    // antd Color 객체 → HEX 문자열
                                    const hex = c.toHexString?.() ?? c.toRgbString();
                                    updateLayerColor(item.title, hex);
                                  }}
                                />
                              )}
                            </div>
                          </List.Item>
                        );
                      }}
                    />
                  );
                })}
              </Panel>
            );
          })}
        </Collapse>
      </div>
    </div>
  );
};

export default BasicLayerTab;

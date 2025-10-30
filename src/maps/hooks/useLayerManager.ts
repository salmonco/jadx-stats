import { useMemo, useRef } from "react";
import { Feature } from "ol";
import { Vector as VectorSource } from "ol/source";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";
import BaseLayer from "~/maps/layers/BaseLayer";
import AsyncVectorLayerFactory, { VectorBaseLayerOptions } from "~/maps/classes/AsyncVectorLayerFactory";

export class LayerManager {
  map: ExtendedOLMap;
  layers: Map<string, BaseLayer>;

  constructor(map: ExtendedOLMap) {
    if (!(map instanceof ExtendedOLMap)) {
      throw new Error("LayerManager requires an OpenLayers map instance.");
    }
    this.map = map;
    this.layers = new Map();
  }

  getOrderedLayers(): [string, BaseLayer][] {
    return this.map
      .getLayers()
      .getArray()
      .map((olLayer) => {
        for (const [key, baseLayer] of this.layers.entries()) {
          if (baseLayer.getLayer() === olLayer) {
            return [key, baseLayer];
          }
        }
        return null;
      })
      .filter((layer): layer is [string, BaseLayer] => layer !== null);
  }

  async addLayer(layer: BaseLayer | Promise<BaseLayer>, key: string = null, zIndex: number | null = null): Promise<string> {
    const resolvedLayer = await Promise.resolve(layer);

    if (!(resolvedLayer instanceof BaseLayer)) {
      throw new Error("The object to add must be an instance of BaseLayer.");
    }

    key = key || resolvedLayer.getLayer().get("title") || `layer-${this.layers.size + 1}`;

    if (this.layers.has(key)) {
      this.map.removeLayer(this.layers.get(key)!.getLayer());
    }

    this.layers.set(key, resolvedLayer);

    // zIndex 설정
    if (zIndex !== null) {
      resolvedLayer.getLayer().setZIndex(zIndex);
    }

    // 배경지도는 맨 아래에 추가
    if (key === "tile") {
      this.map.getLayers().insertAt(0, resolvedLayer.getLayer());
    } else if (zIndex !== null) {
      // 만약 zIndex가 설정된 경우 해당 위치에 추가
      const layersArray = this.map.getLayers().getArray();
      let inserted = false;
      for (let i = 0; i < layersArray.length; i++) {
        if (layersArray[i].getZIndex() > zIndex) {
          this.map.getLayers().insertAt(i, resolvedLayer.getLayer());
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        this.map.addLayer(resolvedLayer.getLayer());
      }
    } else {
      this.map.addLayer(resolvedLayer.getLayer());
    }

    return key;
  }

  removeLayer(key: string) {
    const layer = this.layers.get(key);
    if (layer) {
      this.map.removeLayer(layer.getLayer());
      this.layers.delete(key);
    }
  }

  removeAllLayers() {
    this.layers.forEach((layer) => this.map.removeLayer(layer.getLayer()));
    this.layers.clear();
  }

  removeAllExceptTileLayer() {
    this.layers.forEach((layer, key) => {
      if (key !== "tile") {
        this.map.removeLayer(layer.getLayer());
        this.layers.delete(key);
      }
    });
  }

  toggleLayer(key: string) {
    const layer = this.layers.get(key);
    if (layer) {
      layer.getLayer().setVisible(!layer.getLayer().getVisible());
    }
  }

  setLayerVisibility(key: string, visible: boolean) {
    const layer = this.layers.get(key);
    if (layer) {
      layer.getLayer().setVisible(visible);
    }
  }

  getLayer(key: string): BaseLayer | undefined {
    return this.layers.get(key);
  }

  getAllLayers(): BaseLayer[] {
    return Array.from(this.layers.values());
  }

  moveLayer(key: string, newIndex: number) {
    const olLayer = this.layers.get(key)?.getLayer();
    if (!olLayer) return;

    const coll = this.map.getLayers();
    const arr = coll.getArray();
    const oldIdx = arr.indexOf(olLayer);
    if (oldIdx === -1 || newIndex === oldIdx) return;

    // tile(배경)·highlight 고정 범위 계산
    const tileLyr = this.layers.get("tile")?.getLayer();
    const tileIdx = tileLyr ? arr.indexOf(tileLyr) : -1;
    const highlightLyr = this.layers.get("highlightLayer")?.getLayer();
    const highlightIdx = highlightLyr ? arr.indexOf(highlightLyr) : -1;

    const minIdx = tileIdx >= 0 ? tileIdx + 1 : 0; // tile 위부터 가능
    const maxIdx = highlightIdx >= 0 ? highlightIdx - 1 : arr.length - 1;

    newIndex = Math.max(minIdx, Math.min(newIndex, maxIdx));
    if (newIndex === oldIdx) return;

    coll.removeAt(oldIdx);
    coll.insertAt(newIndex, olLayer);

    // zIndex를 순서대로 맞춰 두기
    coll.getArray().forEach((lyr, i) => lyr.setZIndex(i));
  }

  moveLayerUp(key: string) {
    const arr = this.map.getLayers().getArray();
    const ol = this.layers.get(key)?.getLayer();
    if (!ol) return;
    const idx = arr.indexOf(ol);
    if (idx > 0) this.moveLayer(key, idx - 1);
  }

  moveLayerDown(key: string) {
    const arr = this.map.getLayers().getArray();
    const ol = this.layers.get(key)?.getLayer();
    if (!ol) return;
    const idx = arr.indexOf(ol);
    if (idx !== -1) this.moveLayer(key, idx + 1);
  }

  async replaceFeatures(key: string, features: Promise<Feature[]> | Feature[]): Promise<void> {
    if (!this.layers.has(key)) {
      throw new Error(`Layer with key '${key}' does not exist.`);
    }
    const resolvedFeatures = await Promise.resolve(features);
    if (!Array.isArray(resolvedFeatures)) {
      throw new Error("The features provided must be an array of Feature objects.");
    }

    const source = this.layers.get(key)?.getLayer().getSource();
    if (source instanceof VectorSource) {
      source.clear();
      source.addFeatures(resolvedFeatures);
    } else {
      throw new Error("The source of the specified layer is not a vector source.");
    }
  }

  async addOrReplaceLayer(key: string, features: Promise<Feature[]> | Feature[], options: VectorBaseLayerOptions = {}, verboseName: string | null = null): Promise<void> {
    if (this.getLayer(key)) {
      await this.replaceFeatures(key, features);
    } else {
      const asyncLayer = await AsyncVectorLayerFactory.createLayer(Promise.resolve(features), options, verboseName);
      await this.addLayer(asyncLayer, key);
    }
  }
}

const useLayerManager = (map: ExtendedOLMap | null): LayerManager | null => {
  const layerManager = useRef<LayerManager | null>(null);

  useMemo(() => {
    if (map) {
      const lm = new LayerManager(map);
      layerManager.current = lm;

      // 초기화 시 기존 레이어 제거
      map.getLayers().clear();
    }
  }, [map]);

  return layerManager.current;
};

export default useLayerManager;

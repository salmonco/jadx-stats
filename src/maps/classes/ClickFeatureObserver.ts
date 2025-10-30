import Feature from "ol/Feature";
import { MapBrowserEvent } from "ol";
import { OLObserver } from "~/maps/hooks/useEventManager";

export type DefaultEvent = MapBrowserEvent<PointerEvent>;

export type OnFeatureClick = (feature: Feature, event: DefaultEvent) => void;

export interface ClickFeatureObserverProps {
  onFeatureClick?: OnFeatureClick;
  filters?: ClickFeatureFilter[];
  hitTolerance?: number;
}

export interface ClickFeatureFilter {
  filterFn: (feature: Feature) => boolean;
  callback?: (feature: Feature, event: DefaultEvent) => void;
}
class ClickFeatureObserver implements OLObserver {
  private onFeatureClick: OnFeatureClick;
  private filters: ClickFeatureFilter[];
  private hitTolerance: number;
  constructor({ onFeatureClick, filters = [], hitTolerance = 5 }: ClickFeatureObserverProps) {
    this.onFeatureClick = onFeatureClick || (() => {});
    this.filters = filters;
    this.hitTolerance = hitTolerance;
  }

  onEvent(eventType: string, event: DefaultEvent): void {
    if (eventType !== "singleclick") return;

    const map = event.map;

    map.forEachFeatureAtPixel(
      event.pixel,
      (feature: Feature) => {
        if (this.filters.length) {
          for (const { filterFn, callback } of this.filters) {
            if (filterFn(feature)) {
              callback?.(feature, event);
              this.onFeatureClick(feature, event);
              return true;
            }
          }
        }

        this.onFeatureClick(feature, event);
        return true;
      },
      {
        hitTolerance: this.hitTolerance,
        layerFilter: (layer) => {
          return !layer.get("ignoreClick");
        },
      }
    );
  }
}

export default ClickFeatureObserver;

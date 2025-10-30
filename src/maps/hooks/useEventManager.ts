import { useMemo, useRef } from "react";
import { Map as OLMap } from "ol";
import { throttle } from "~/utils/common";

export interface OLObserver {
  onEvent(eventType: string, event: any): void;
}

export class EventManager {
  map: OLMap;
  private observers: OLObserver[] = [];

  constructor(map: OLMap) {
    if (!(map instanceof OLMap)) {
      throw new Error("EventManager requires an OpenLayers map instance.");
    }
    this.map = map;
  }

  addObserver(observer: OLObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: OLObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers(eventType: string, event: any): void {
    for (const observer of this.observers) {
      observer.onEvent(eventType, event);
    }
  }

  attachEventHandlers(): void {
    const throttledPointerMove = throttle((event) => this.handleEvent("pointermove", event), 100);
    this.map.on("pointermove", throttledPointerMove);
    // this.map.on('pointermove', (event) => this.handleEvent('pointermove', event));
    this.map.on("singleclick", (event) => this.handleEvent("singleclick", event));
  }

  cleanUp(): void {
    this.map.un("pointermove", (event) => this.handleEvent("pointermove", event));
    this.map.un("singleclick", (event) => this.handleEvent("singleclick", event));
  }

  private handleEvent(eventType: string, event: any): void {
    this.notifyObservers(eventType, event);
  }
}

const useEventManager = (map: OLMap): EventManager | null => {
  const eventManager = useRef<EventManager | null>(null);

  useMemo(() => {
    if (map) {
      eventManager.current = new EventManager(map);
    }
    // if (!eventManager.current && map) {
    //     eventManager.current = new EventManager(map);
    // }
    // else if (eventManager.current && map) {
    //     eventManager.current.map = map;
    // }
  }, [map]);

  return eventManager.current;
};

export default useEventManager;

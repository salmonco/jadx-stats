import { useEffect } from "react";
import ClickFeatureObserver, { OnFeatureClick } from "~/maps/classes/ClickFeatureObserver";
import HighlightFeatureObserver from "~/maps/classes/HighlightFeatureObserver";
import { EventManager } from "~/maps/hooks/useEventManager";

export const useEventHandlers = (eventManager: EventManager, ready: boolean, onFeatureClick: OnFeatureClick) => {
  useEffect(() => {
    if (!ready || !eventManager) return;

    eventManager.addObserver(new HighlightFeatureObserver(false));
    eventManager.addObserver(
      new ClickFeatureObserver({
        onFeatureClick,
        // filters: []
      })
    );
    eventManager.attachEventHandlers();
    return () => {
      eventManager.cleanUp();
    };
  }, [eventManager, ready]);
};

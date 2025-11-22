import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import AgingStatusChart from "~/maps/components/agingStatus/AgingStatusChart";
import AgingStatusMapContent from "~/maps/components/agingStatus/AgingStatusMapContent";

class AgingStatusMap extends CommonBackgroundMap {
  renderMap(onClickFullScreen: (mapId: string) => void, getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement) {
    return <AgingStatusMapContent mapId={this.mapId} onClickFullScreen={onClickFullScreen} getPopupContainer={getPopupContainer} />;
  }

  renderChart() {
    return <AgingStatusChart map={this} />;
  }
}

export default AgingStatusMap;

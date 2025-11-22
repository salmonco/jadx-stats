import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import AgingStatusChart from "~/maps/components/agingStatus/AgingStatusChart";
import AgingStatusMapContent from "~/maps/components/agingStatus/AgingStatusMapContent";

class AgingStatusMap extends CommonBackgroundMap {
  renderMap(onClickFullScreen: (mapId: string) => void) {
    return <AgingStatusMapContent mapId={this.mapId} onClickFullScreen={onClickFullScreen} />;
  }

  renderChart() {
    return <AgingStatusChart map={this} />;
  }
}

export default AgingStatusMap;

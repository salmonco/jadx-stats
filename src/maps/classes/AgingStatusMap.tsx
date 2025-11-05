import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import AgingStatusChart from "~/maps/components/agingStatus/AgingStatusChart";
import AgingStatusMapContent from "~/maps/components/agingStatus/AgingStatusMapContent";

class AgingStatusMap extends CommonBackgroundMap {
  renderMap() {
    return <AgingStatusMapContent mapId={this.mapId} />;
  }

  renderChart() {
    return <AgingStatusChart />;
  }
}

export default AgingStatusMap;

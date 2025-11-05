import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import AgingStatusChart from "~/maps/components/agingStatus/AgingStatusChart";
import AgingStatusMapContent from "~/maps/components/agingStatus/AgingStatusMapContent";

class AgingStatusMap extends CommonBackgroundMap {
  renderMap() {
    return <AgingStatusMapContent mapId={this.mapId} mapOptions={this.mapOptions} selectedRegionLevel={this.getSelectedRegionLevel()} excludeDong={this.excludeDong} />;
  }

  renderChart() {
    return <AgingStatusChart selectedRegionLevel={this.getSelectedRegionLevel()} excludeDong={this.excludeDong} />;
  }
}

export default AgingStatusMap;

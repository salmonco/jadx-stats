import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import TestHeatmapMapContent from "~/maps/components/TestHeatmapMapContent";

class TestHeatmapMap extends CommonBackgroundMap {
  renderMap() {
    return <TestHeatmapMapContent mapId={this.mapId} />;
  }

  renderChart() {
    return <></>;
  }
}

export default TestHeatmapMap;

import { useMapList } from "~/maps/hooks/useMapList";

const ListManagedVisualizationContainer = () => {
  const mapList = useMapList();

  return (
    <div className="flex flex-col gap-5 bg-[#37445E] px-5 py-4">
      {/* 지도 */}
      {mapList.renderMaps()}
      {/* 차트 */}
      <div id="main-chart-container">{mapList.renderFirstChart()}</div>
    </div>
  );
};

export default ListManagedVisualizationContainer;

import { useMapList } from "~/maps/hooks/useMapList";

const ListManagedVisualizationContainer = () => {
  const mapList = useMapList();

  return (
    <div className="flex min-h-screen w-full flex-col gap-5 p-5">
      <div className="flex flex-col gap-5 rounded-lg bg-[#37445E] p-5">
        {/* 지도 */}
        {mapList.renderMaps()}
        {/* 차트 */}
        {mapList.renderFirstChart()}
      </div>
    </div>
  );
};

export default ListManagedVisualizationContainer;

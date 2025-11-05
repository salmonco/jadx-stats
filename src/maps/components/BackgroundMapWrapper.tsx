import LayerHeader from "~/maps/components/LayerHeader";
import useMapFullScreen from "~/maps/hooks/useMapFullscreen";

interface BackgroundMapWrapperProps {
  title: string;
  tooltip?: React.ReactNode;
  maps: Array<React.ReactNode>;
  onAddMap: () => void;
}

const BackgroundMapWrapper = ({ title, tooltip, maps, onAddMap }: BackgroundMapWrapperProps) => {
  const { mapContainerRef, onClickFullScreen } = useMapFullScreen();

  return (
    <div className="relative flex h-full w-full" ref={mapContainerRef}>
      {maps.map((map, i) => (
        <div key={i} className="flex-1">
          {map}
        </div>
      ))}
      <LayerHeader title={title} tooltip={tooltip} onClickFullScreen={onClickFullScreen} onAddMap={onAddMap} />
    </div>
  );
};

export default BackgroundMapWrapper;

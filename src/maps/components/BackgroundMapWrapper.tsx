import { useRef } from "react";
import LayerHeader from "~/maps/components/LayerHeader";

interface BackgroundMapWrapperProps {
  title: string;
  tooltip?: React.ReactNode;
  maps: Array<React.ReactNode>;
}

const BackgroundMapWrapper = ({ title, tooltip, maps }: BackgroundMapWrapperProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleFullscreenClick = () => {
    if (!mapContainerRef.current) {
      return;
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }

    mapContainerRef.current.requestFullscreen();
  };

  return (
    <div className="relative flex h-full w-full" ref={mapContainerRef}>
      {maps.map((map) => (
        <div key={map.toString()} className="flex-1">
          {map}
        </div>
      ))}
      <LayerHeader title={title} tooltip={tooltip} onClickFullscreen={handleFullscreenClick} />
    </div>
  );
};

export default BackgroundMapWrapper;

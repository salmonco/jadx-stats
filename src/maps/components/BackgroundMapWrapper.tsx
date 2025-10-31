import { LayerHeader } from "~/maps/components/LayerHeader";

interface BackgroundMapWrapperProps {
  title: string;
  tooltip?: React.ReactNode;
  maps: Array<React.ReactNode>;
}

const BackgroundMapWrapper = ({ title, tooltip, maps }: BackgroundMapWrapperProps) => {
  return (
    <div className="relative flex h-full w-full">
      {maps.map((map) => (
        <div key={map.toString()} className="flex-1">
          {map}
        </div>
      ))}
      <LayerHeader title={title} tooltip={tooltip} />
    </div>
  );
};

export default BackgroundMapWrapper;

interface BackgroundMapWrapperProps {
  maps: Array<React.ReactNode>;
}

const BackgroundMapWrapper = ({ maps }: BackgroundMapWrapperProps) => {
  return (
    <div className="relative flex h-full w-full">
      {maps.map((map, i) => (
        <div key={i} className="flex-1">
          {map}
        </div>
      ))}
    </div>
  );
};

export default BackgroundMapWrapper;

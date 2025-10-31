import { useRef } from "react";

const useMapFullScreen = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const onClickFullScreen = () => {
    if (!mapContainerRef.current) {
      return;
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }

    mapContainerRef.current.requestFullscreen();
  };

  return { mapContainerRef, onClickFullScreen };
};

export default useMapFullScreen;

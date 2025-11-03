import { useEffect } from "react";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";

interface Params {
  mapList: BackgroundMapList;
}

const useMapSharedStateInitializer = ({ mapList }: Params) => {
  useEffect(() => {
    const initializeFromURL = async () => {
      const params = new URLSearchParams(window.location.search);
      const config = params.get("config");

      if (config) {
        try {
          // URL-safe Base64 디코딩
          const base64 = config.replace(/-/g, "+").replace(/_/g, "/");
          const binary = atob(base64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }

          // gzip 압축 해제 -> JSON 파싱
          const stream = new Blob([bytes]).stream();
          const decompressedStream = stream.pipeThrough(new DecompressionStream("gzip"));
          const decompressedResponse = new Response(decompressedStream);
          const jsonState = await decompressedResponse.text();
          const state = JSON.parse(jsonState);
          mapList.initSharedState(state);
        } catch (error) {
          console.error("Failed to parse or decompress share configuration:", error);
        }
      }
    };

    initializeFromURL();
  }, [mapList]);
};

export default useMapSharedStateInitializer;

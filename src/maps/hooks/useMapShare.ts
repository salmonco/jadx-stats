import { useState } from "react";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";

interface Params {
  map: CommonBackgroundMap;
}

const useMapShare = ({ map }: Params) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const onClickShare = async () => {
    if (isShareModalOpen) {
      setIsShareModalOpen(false);
      return;
    }

    if (!map) {
      alert("맵 정보를 찾을 수 없어 공유 링크를 생성할 수 없습니다.");
      return;
    }

    try {
      const state = map.getShareableState();

      // JSON -> 직렬화 -> gzip 압축
      const jsonState = JSON.stringify(state);
      const stream = new Blob([jsonState]).stream();
      const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));
      const compressedResponse = new Response(compressedStream);
      const blob = await compressedResponse.blob();
      const buffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      // URL-safe Base64 인코딩
      const safeBase64State = btoa(String.fromCharCode.apply(null, bytes as unknown as number[]))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      const url = `${window.location.origin}${window.location.pathname}?config=${safeBase64State}`;

      setShareUrl(url);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error("공유 링크 생성 중 오류 발생:", error);
      alert("공유 링크 생성 중 오류가 발생했습니다.");
    }
  };

  const onCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return {
    isShareModalOpen,
    shareUrl,
    onClickShare,
    onCloseShareModal,
  };
};

export default useMapShare;

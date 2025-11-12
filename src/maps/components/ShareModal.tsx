import { Book, Copy, Facebook, MessageCircle, Twitter, X } from "lucide-react";
import { useRef, useState } from "react";

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

const COPIED_TIMEOUT = 2000;

const ShareModal = ({ url, onClose }: ShareModalProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    inputRef.current?.select();
    document.execCommand("copy");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), COPIED_TIMEOUT);
  };

  const handleShareFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  const handleShareX = () => {
    const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("JASIS 지도를 공유합니다.")}`;
    window.open(xShareUrl, "_blank", "width=600,height=400");
  };

  const handleShareNaverBlog = () => {
    const naverBlogShareUrl = `https://blog.naver.com/openapi/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent("JASIS 지도 공유")}`;
    window.open(naverBlogShareUrl, "_blank", "width=720,height=600");
  };

  const handleShareKakaoTalk = () => {
    if (window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: "text",
        text: "JASIS 지도를 공유합니다.",
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      });
    } else {
      alert("카카오톡 SDK가 로드되지 않았습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">공유하기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="mt-8 flex justify-around">
          <button onClick={handleShareFacebook} className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600">
            <Facebook size={32} />
            <span>페이스북</span>
          </button>
          <button onClick={handleShareX} className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800">
            <Twitter size={32} />
            <span>X</span>
          </button>
          <button onClick={handleShareNaverBlog} className="flex flex-col items-center gap-1 text-gray-600 hover:text-green-600">
            <Book size={32} />
            <span>네이버 블로그</span>
          </button>
          <button onClick={handleShareKakaoTalk} className="flex flex-col items-center gap-1 text-gray-600 hover:text-yellow-600">
            <MessageCircle size={32} />
            <span>카카오톡</span>
          </button>
        </div>
        <div className="mt-8 flex items-center space-x-2">
          <input ref={inputRef} type="text" readOnly value={url} className="w-full rounded-md border border-gray-300 bg-gray-50 p-2" />
          <button onClick={handleCopy} className="flex flex-shrink-0 items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            <Copy size={18} />
            <span>{isCopied ? "복사됨!" : "복사"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

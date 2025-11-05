import { Copy, X } from "lucide-react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">공유하기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <p className="mt-4 text-gray-600">아래 URL을 복사하여 다른 사람과 공유하세요.</p>
        <div className="mt-4 flex items-center space-x-2">
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

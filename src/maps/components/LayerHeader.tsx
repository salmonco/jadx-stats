interface LayerHeaderProps {
  title: string;
  tooltip: React.ReactNode;
}

export const LayerHeader = ({ title, tooltip }: LayerHeaderProps) => {
  return (
    <div className="absolute left-0 top-0 flex w-full justify-between bg-[#37445E] p-3">
      <div className="flex items-center gap-2.5">
        <div className="text-2xl font-semibold text-white">{title}</div>
        {tooltip}
      </div>
      <div className="flex items-center gap-4">
        <div>보고서</div>
        <div>전체화면</div>
        <div>공유</div>
        <div>다중뷰</div>
      </div>
    </div>
  );
};

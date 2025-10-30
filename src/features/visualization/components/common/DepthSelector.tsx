export interface DepthScrollSelectorOption {
  gb: "region" | "emd1" | "emd2";
  value: string;
  color: string;
}

interface SimpleTwoDepthProps<T> {
  firstOptions: T[];
  secondOptions: T[];
  title?: string;
  firstHeader?: string;
  secondHeader?: string;
  selected: T[];
  onSelect: (values: T[]) => void;
}

const TwoDepthSelector = <T extends { value: string; color: string }>({
  firstOptions,
  secondOptions,
  title = "선택",
  firstHeader = "제주시",
  secondHeader = "서귀포시",
  selected,
  onSelect,
}: SimpleTwoDepthProps<T>) => {
  const toggleSelect = (option: T) => {
    const exists = selected.find((item) => item.value === option.value);
    if (exists) {
      onSelect(selected.filter((item) => item.value !== option.value));
    } else {
      onSelect([...selected, option]);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-[#43516D] p-5">
      <p className="text-[18px] font-semibold text-white">{title}</p>
      <div className="flex max-h-[220px] gap-2">
        {/* 첫 번째 리스트 */}
        <div className="w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 text-[#222]">
          <div
            style={{
              padding: "5px",
              fontWeight: "bold",
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ddd",
              cursor: "default",
              userSelect: "none",
              position: "sticky",
              zIndex: 1,
              top: 0,
            }}
          >
            {firstHeader}
          </div>
          {firstOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => toggleSelect(option)}
              style={{
                padding: "5px",
                cursor: "pointer",
                backgroundColor: selected.some((item) => item.value === option.value)
                  ? option.color
                  : "transparent",
              }}
            >
              {option.value}
            </div>
          ))}
        </div>

        {/* 두 번째 리스트 */}
        <div className="w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 text-[#222]">
          <div
            style={{
              padding: "5px",
              fontWeight: "bold",
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ddd",
              cursor: "default",
              userSelect: "none",
              position: "sticky",
              zIndex: 1,
              top: 0,
            }}
          >
            {secondHeader}
          </div>
          {secondOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => toggleSelect(option)}
              style={{
                padding: "5px",
                cursor: "pointer",
                backgroundColor: selected.some((item) => item.value === option.value)
                  ? option.color
                  : "transparent",
              }}
            >
              {option.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwoDepthSelector;

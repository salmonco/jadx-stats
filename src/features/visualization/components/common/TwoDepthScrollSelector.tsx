interface Props<T, M extends boolean = false> {
  options: Record<string, string[]>;
  title?: string;
  multiSelectSecond?: M;
  selectedFirst: T;
  selectedSecond?: M extends true ? T[] : T;
  onFirstSelect: (value: T) => void;
  onSecondSelect: (value: M extends true ? T[] : T) => void;
  hasSecondDepth?: boolean;
}

const TwoDepthScrollSelector = <T extends string, M extends boolean = false>({
  options,
  title = "선택",
  multiSelectSecond = false as M,
  selectedFirst,
  selectedSecond,
  onFirstSelect,
  onSecondSelect,
  hasSecondDepth = true,
}: Props<T, M>) => {
  const handleFirstClick = (option: T) => {
    onFirstSelect(option);
  };

  const handleSecondClick = (option: T) => {
    if (multiSelectSecond) {
      const newSelection =
        Array.isArray(selectedSecond) && selectedSecond.includes(option)
          ? selectedSecond.filter((item) => item !== option)
          : [...(Array.isArray(selectedSecond) ? selectedSecond : []), option];
      onSecondSelect(newSelection as M extends true ? T[] : T);
    } else {
      onSecondSelect(option as M extends true ? T[] : T);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-[#43516D] p-5">
      <p className="text-[18px] font-semibold text-white">{title}</p>
      <div className="flex max-h-[220px] gap-2">
        <div className="w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 text-[#222]">
          {Object.keys(options)?.map((option) => (
            <div
              key={option}
              onClick={() => handleFirstClick(option as T)}
              style={{
                padding: "5px",
                cursor: "pointer",
                backgroundColor: selectedFirst === option ? "#e0e0e0" : "transparent",
              }}
            >
              {option}
            </div>
          ))}
        </div>

        {hasSecondDepth && (
          <div className="w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 text-[#222]">
            {options[selectedFirst]?.map((option) => (
              <div
                key={option}
                onClick={() => handleSecondClick(option as unknown as T)}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  backgroundColor: multiSelectSecond
                    ? Array.isArray(selectedSecond) && selectedSecond.includes(option as unknown as T)
                      ? "#e0e0e0"
                      : "transparent"
                    : selectedSecond === option
                      ? "#e0e0e0"
                      : "transparent",
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoDepthScrollSelector;

interface Props {
  width?: number;
  isFixed?: boolean;
  children: React.ReactNode;
}

const FIXED_WIDTH = 220;

const FilterContainer = ({ children, width, isFixed = false }: Props) => {
  return (
    <div
      className={`${isFixed ? "absolute bottom-4 left-4 top-16" : ""} scrollbar-hide flex flex-col gap-5 overflow-y-auto rounded-lg bg-gray-100 p-4`}
      style={{
        width: isFixed ? FIXED_WIDTH : width,
      }}
    >
      {children}
    </div>
  );
};

export default FilterContainer;

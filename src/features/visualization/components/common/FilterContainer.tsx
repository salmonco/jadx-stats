interface Props {
  width?: number;
  isFixed?: boolean;
  children: React.ReactNode;
}

const FilterContainer = ({ children, isFixed = false }: Props) => {
  return <div className={`${isFixed ? "flex-[2]" : ""} scrollbar-hide flex flex-col gap-3 overflow-y-auto rounded-lg bg-white p-4 opacity-90`}>{children}</div>;
};

export default FilterContainer;

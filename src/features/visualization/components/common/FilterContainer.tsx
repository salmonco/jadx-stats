interface Props {
  width?: number;
  isFixed?: boolean;
  children: React.ReactNode;
}

const FilterContainer = ({ children, isFixed = false }: Props) => {
  return <div className={`${isFixed ? "flex-[2]" : ""} scrollbar-hide flex flex-col gap-5 overflow-y-auto rounded-lg bg-gray-100 p-4`}>{children}</div>;
};

export default FilterContainer;

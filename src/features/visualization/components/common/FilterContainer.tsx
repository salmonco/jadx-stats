interface Props {
  width?: number;
  children: React.ReactNode;
}

const FilterContainer = ({ children, width }: Props) => {
  return (
    <div className="flex h-full flex-col gap-5 rounded-lg bg-gray-100 p-4" style={{ width }}>
      {children}
    </div>
  );
};

export default FilterContainer;

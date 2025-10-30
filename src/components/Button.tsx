interface Props {
  label: string;
  onClick: () => void;
  isSelected: boolean;
  buttonStyle?: string;
}

const Button = ({ label, onClick, isSelected, buttonStyle }: Props) => {
  const selectedStyle = isSelected ? "border-2 border-[#ffc132] text-[#ffc132]" : "border-[#37445E] text-[#676F83]";

  return (
    <button onClick={onClick} className={`rounded-lg border bg-[#37445E] text-[15px] text-white ${selectedStyle} ${buttonStyle}`}>
      {label}
    </button>
  );
};

export default Button;

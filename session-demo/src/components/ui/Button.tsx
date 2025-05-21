interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  children,
  className,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      className={`flex flex-col justify-center items-center gap-2 w-[322px] h-[48px] shrink-0 rounded-[12px] cursor-pointer bg-[#11E5C5] hover:bg-[#7dffeb] text-[#3C3C40] text-center font-poppins text-sm font-medium leading-[110%] active:bg-[#11e5c57c] ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

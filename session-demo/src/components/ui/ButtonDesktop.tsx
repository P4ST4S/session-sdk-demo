interface ButtonDesktopProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type: "continue" | "back";
}

const ButtonDesktop = ({
  children,
  className,
  onClick,
  disabled = false,
  type,
}: ButtonDesktopProps) => {
  return (
    <>
      {type === "continue" ? (
        <button
          className={`inline-flex h-9 items-center justify-center gap-2 shrink-0 cursor-pointer bg-[#11E5C5] hover:bg-[#7dffeb] text-[#3C3C40] rounded-md ${className}`}
          onClick={onClick}
          disabled={disabled}
        >
          <span className="mx-6 text-sm">{children}</span>
        </button>
      ) : (
        <button
          className={`inline-flex h-9 items-center justify-center gap-2 shrink-0 cursor-pointer bg-transparent border-1 border-[#3C3C40] hover:bg-[#3c3c401e] text-[#3C3C40] rounded-md ${className}`}
          onClick={onClick}
          disabled={disabled}
        >
          <span className="mx-6 text-sm">{children}</span>
        </button>
      )}
    </>
  );
};

export default ButtonDesktop;

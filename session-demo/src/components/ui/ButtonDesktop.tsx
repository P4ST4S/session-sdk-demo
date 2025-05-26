/**
 * ButtonDesktop component
 *
 * A specialized button component for desktop interfaces with two style variants.
 * Can be rendered as either a primary "continue" button (teal background) or
 * a secondary "back" button (transparent with border).
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered inside the button
 * @param {string} [props.className] - Optional additional CSS classes to apply
 * @param {() => void} [props.onClick] - Optional click handler function
 * @param {boolean} [props.disabled=false] - Whether the button is disabled (defaults to false)
 * @param {"continue" | "back"} props.type - Button style variant to display
 * @returns {JSX.Element} Styled button element in either continue or back style
 */
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

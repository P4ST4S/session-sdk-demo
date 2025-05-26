/**
 * Body component
 *
 * A simple wrapper component that applies consistent text styling for body content.
 * It handles text appearance with a specific color, centering, font size, and weight.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered inside the Body component
 * @param {string} [props.className] - Optional additional CSS classes to apply
 * @returns {JSX.Element} Styled div containing the children
 */
const Body = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={` text-[#3C3C40] text-center text-sm font-medium leading-[120%] ${className}`}
    >
      {children}
    </div>
  );
};

export default Body;

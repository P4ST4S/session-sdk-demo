/**
 * Title component
 *
 * A primary heading component that provides consistent text styling for page titles.
 * Renders an h1 element with predefined styling for color, alignment, font family, size, and weight.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered inside the title
 * @param {string} [props.className] - Optional additional CSS classes to apply
 * @returns {JSX.Element} An h1 element with consistent title styling
 */
const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h1
      className={`text-[#3C3C40] text-center font-poppins text-2xl font-bold leading-[110%] ${className}`}
    >
      {children}
    </h1>
  );
};

export default Title;

/**
 * Subtitle component
 *
 * A simple heading component styled as a subtitle with consistent text properties.
 * Renders an h2 element with predefined styling for color, alignment, size, and weight.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered inside the subtitle
 * @param {string} [props.className] - Optional additional CSS classes to apply
 * @returns {JSX.Element} An h2 element with consistent subtitle styling
 */
const Subtitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={`text-[#3C3C40] text-center text-xs font-semibold leading-[120%] ${className}`}
    >
      {children}
    </h2>
  );
};

export default Subtitle;

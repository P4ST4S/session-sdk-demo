/**
 * Paper component
 *
 * A container component that provides a card-like appearance with a white background,
 * subtle shadow, and rounded corners. Used to group related content with visual separation.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered inside the Paper component
 * @param {string} [props.className=""] - Optional additional CSS classes to apply
 * @returns {JSX.Element} Styled div with paper-like appearance containing the children
 */
const Paper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Paper;

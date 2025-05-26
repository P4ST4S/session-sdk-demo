import PoweredByIcon from "../icons/PoweredByIcon";

/**
 * PoweredBy component
 *
 * A simple component that displays "Propulsé par" (Powered by) text followed by a logo.
 * Used to attribute the service provider at the bottom of forms or pages.
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Optional additional CSS classes to apply
 * @returns {JSX.Element} A container with text and logo centered horizontally
 */
interface PoweredByProps {
  className?: string;
}

const PoweredBy = ({ className }: PoweredByProps) => {
  return (
    <div className={`flex items-center justify-center flex-row ${className}`}>
      <span className="text-xs font-semibold text-[#3C3C40] text-center mt-0.5">
        Propulsé par&nbsp;
      </span>
      <PoweredByIcon className="inline-block w-[90px] h-[18px] mb-[2px] ml-1" />
    </div>
  );
};

export default PoweredBy;

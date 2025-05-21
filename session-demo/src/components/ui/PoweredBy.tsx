import PoweredByIcon from "../icons/PoweredByIcon";

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

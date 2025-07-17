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

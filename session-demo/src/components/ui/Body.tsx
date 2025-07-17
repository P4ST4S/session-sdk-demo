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

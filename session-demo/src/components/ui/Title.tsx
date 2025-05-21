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

import type { ReactNode } from "react";

interface PaperProps {
  children: ReactNode;
  className?: string;
}

const Paper = ({ children, className = "" }: PaperProps) => {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default Paper;

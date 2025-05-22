import { useEffect, useState } from "react";

const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handleChange = () => setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    handleChange(); // initial check

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;

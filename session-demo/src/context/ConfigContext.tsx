import React, { useEffect, type ReactNode } from "react";
import { configureApiBaseURL } from "../services/api";

interface WindowWithEnv extends Window {
  ENV?: {
    VITE_API_URL?: string;
  };
}

interface ConfigProviderProps {
  children: ReactNode;
  apiBaseUrl?: string;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  apiBaseUrl,
}) => {
  // Fallback hierarchy: provided apiBaseUrl > env variable > default localhost
  const resolvedApiBaseUrl =
    apiBaseUrl ||
    (typeof window !== "undefined" &&
      (window as WindowWithEnv)?.ENV?.VITE_API_URL) ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8888";

  console.log('🔧 ConfigProvider - apiBaseUrl reçue en props:', apiBaseUrl);
  console.log('🔧 ConfigProvider - URL résolue:', resolvedApiBaseUrl);

  // Configure the API service with the resolved URL
  useEffect(() => {
    console.log('🔧 ConfigProvider - Configuration de l\'API avec:', resolvedApiBaseUrl);
    configureApiBaseURL(resolvedApiBaseUrl);
  }, [resolvedApiBaseUrl]);

  return <>{children}</>;
};

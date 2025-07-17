/**
 * Environment configuration
 * This file exposes environment variables to use across the application
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8888";

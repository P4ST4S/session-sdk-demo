import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement du fichier .env
  const env = loadEnv(mode, process.cwd());

  return {
    build: {
      sourcemap: false,
    },
    plugins: [react(), tailwindcss()],
    server: {
      port: parseInt(env.VITE_PORT || "3000"),
      open: true,
      strictPort: true,
    },
    preview: {
      port: parseInt(env.VITE_PORT || "3000"),
    },
  };
});

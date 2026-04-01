import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    IS_DEV: JSON.stringify(true),
  },
  resolve: {
    alias: {
      "@axon-enterprise/spark": "@axon-enterprise/spark/react-router-v6",
    },
  },
});

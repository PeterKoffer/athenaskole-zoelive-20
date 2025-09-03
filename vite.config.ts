import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src/core"),
      "@features": path.resolve(__dirname, "src/features"),
      "@ui": path.resolve(__dirname, "src/shared/ui"),
      "@lib": path.resolve(__dirname, "src/shared/lib"),
      "@config": path.resolve(__dirname, "src/shared/config"),
      "@stores": path.resolve(__dirname, "src/shared/stores"),
      "@types": path.resolve(__dirname, "src/core/domain/types")
    }
  }
});

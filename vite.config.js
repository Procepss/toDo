/* eslint-disable no-undef */
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "src",
  publicDir: "public",
  assetsInclude: ["**/*.svg"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});

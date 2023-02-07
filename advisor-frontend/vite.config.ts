import { defineConfig } from "vitest/config";
import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
  },
  plugins: [reactRefresh(), react()],
  test: {
    coverage: {
      reporter: ["json", "html", "text", "lcov"],
    },

    globals: true,

    environment: "jsdom",

    setupFiles: "./src/setupTests.ts",
  },
});

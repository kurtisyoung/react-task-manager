import { defineConfig, coverageConfigDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@vanilla-extract/babel-plugin"],
      },
    }),
    vanillaExtractPlugin(),
    tsconfigPaths(),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    deps: {
      fallbackCJS: true,
    },
    coverage: {
      provider: "v8",
      exclude: [
        "node_modules",
        "build",
        "public",
        "dist",
        "react-router.config.ts",
        "vitest.config.ts",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "app/routes.ts",
        "app/root.tsx",
        "app/styles/*",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), vanillaExtractPlugin()],
  base: "/react-task-manager",
});

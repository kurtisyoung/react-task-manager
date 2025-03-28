import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), vanillaExtractPlugin()],
  // If the DEPLOY_ENV is production, the base is /react-task-manager/
  base: process.env.DEPLOY_ENV === "production" ? "/react-task-manager/" : "/",
});

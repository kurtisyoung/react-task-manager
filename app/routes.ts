import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("/tasks", "routes/tasks/index.tsx"),
] satisfies RouteConfig;

import { type RouteConfig, index, route } from "@react-router/dev/routes";
// import ProtectedRoute from "~/components/ProtectedRoute";

export default [
  index("routes/home/index.tsx"),
  route("/tasks", "routes/tasks/index.tsx"),
] satisfies RouteConfig;

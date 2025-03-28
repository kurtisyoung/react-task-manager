import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { TaskProvider } from "./context/TaskContext";
import { AuthProvider } from "./context/AuthContext";
import favicon from "/favicon.png";
import type { Route } from "./+types/root";
import "./styles/global.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/png", href: favicon },
];

export const meta: Route.MetaFunction = () => [
  { title: "React Task Manager" },
  {
    name: "description",
    content:
      "A modern task management application to help you stay organized and productive.",
  },
  {
    name: "keywords",
    content: "task manager, todo list, productivity, organization, react",
  },
  { name: "author", content: "React Task Manager" },
  { property: "og:title", content: "React Task Manager" },
  {
    property: "og:description",
    content:
      "A modern task management application to help you stay organized and productive.",
  },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "aritzia-logo.svg" },
  { name: "twitter:title", content: "React Task Manager" },
  {
    name: "twitter:description",
    content:
      "A modern task management application to help you stay organized and productive.",
  },
  { name: "theme-color", content: "#1a1a1a" },
  { name: "robots", content: "index, follow" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Outlet />
      </TaskProvider>
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

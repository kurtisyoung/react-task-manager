import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import InputGroup from "~/components/InputGroup";
import Header from "~/components/Header";
import * as styles from "./Home.css";

export function meta() {
  return [
    { title: "Welcome | React Task Manager" },
    {
      name: "description",
      content:
        "Get started with React Task Manager - A modern task management application. Sign in to create, organize, and track your tasks efficiently.",
    },
    {
      name: "keywords",
      content:
        "task manager, login, sign in, productivity app, task organization",
    },
    { property: "og:title", content: "Welcome | React Task Manager" },
    {
      property: "og:description",
      content:
        "Get started with React Task Manager - A modern task management application. Sign in to create, organize, and track your tasks efficiently.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:title", content: "Welcome | React Task Manager" },
    {
      name: "twitter:description",
      content:
        "Get started with React Task Manager - A modern task management application. Sign in to create, organize, and track your tasks efficiently.",
    },
    { name: "robots", content: "index, nofollow" },
  ];
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/tasks", { replace: true });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <p style={{ maxWidth: "425px", marginBottom: "2rem" }}>
        A simple task manager built with React, React Router and TypeScript.
        Create, organize, and track your tasks with an intuitive interface.
      </p>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "500" }}>Log In</h2>
        <div className={styles.formGroup}>
          <InputGroup
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="email"
          />
          <InputGroup
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="password"
          />
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "~/context/AuthContext";
import InputGroup from "~/components/InputGroup";
import Header from "~/components/Header";
import Button from "~/components/Button";
import * as styles from "./Home.css";

interface LoginFormData {
  email: string;
  password: string;
}

export function meta() {
  return [
    { title: "Welcome | React Task Manager" },
    {
      name: "description",
      content:
        "Get started with React Task Manager - A modern task management application. Sign in to create, organize, and track your tasks efficiently.",
    },
  ];
}

export default function Home() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setError("");
    setIsLoading(true);

    console.log(errors);

    try {
      await login(data.email, data.password);
      navigate("/tasks", { replace: true });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <p style={{ maxWidth: "425px", marginBottom: "2rem" }}>
        A simple task manager built with React, React Router and TypeScript.
        Create, organize, and track your tasks with an intuitive interface.
      </p>

      <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "500" }}>Log In</h2>
        <div className={styles.formGroup}>
          <InputGroup
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
            id="email"
          />
          <InputGroup
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password?.message}
            id="password"
          />
        </div>
        <Button
          as="input"
          variant="submit"
          disabled={isLoading}
          aria-label="Log In"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </Button>
      </form>
    </main>
  );
}

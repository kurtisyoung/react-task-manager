import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Home, { meta } from "./";
import { AuthProvider, useAuth } from "~/context/AuthContext";
import "@testing-library/jest-dom";

// Mock useNavigate and useAuth
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const mockLogin = vi.fn();
vi.mock("~/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: vi.fn(),
    isAuthenticated: false,
  }),
}));

describe("Home", () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders login form with email and password inputs", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: /log in/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/logging in/i);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/tasks", { replace: true });
    });
  });

  test("handles login failure", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent(/log in/i);
    });
  });

  test("meta function returns correct metadata", () => {
    const metadata = meta();

    expect(metadata).toEqual(
      expect.arrayContaining([
        { title: "Welcome | React Task Manager" },
        expect.objectContaining({
          name: "description",
          content: expect.stringContaining("React Task Manager"),
        }),
        expect.objectContaining({
          name: "keywords",
          content: expect.stringContaining("task manager"),
        }),
        expect.objectContaining({
          property: "og:title",
          content: "Welcome | React Task Manager",
        }),
        expect.objectContaining({
          name: "robots",
          content: "index, nofollow",
        }),
      ])
    );
  });
});

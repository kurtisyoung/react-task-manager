import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Home, { meta } from "./";
import "@testing-library/jest-dom";

// Mock useNavigate and useAuth
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock Header component
vi.mock("~/components/Header", () => ({
  default: () => <div data-testid="mock-header">Header</div>,
}));

// Mock AuthContext
const mockLogin = vi.fn();
const mockUseAuth = vi.fn().mockReturnValue({
  login: mockLogin,
  logout: vi.fn(),
  isAuthenticated: false,
});

vi.mock("~/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
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
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      isAuthenticated: false,
    });
  });

  test("renders login form with email and password inputs", () => {
    renderComponent();

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
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

    expect(submitButton).toHaveAttribute("aria-label", "Log In");

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
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveAttribute("aria-label", "Log In");
    });
  });

  test("redirects to tasks when already authenticated", () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      isAuthenticated: true,
    });

    renderComponent();

    expect(mockNavigate).toHaveBeenCalledWith("/tasks", { replace: true });
  });

  test("meta function returns correct metadata", () => {
    const metadata = meta();

    expect(metadata).toEqual([
      { title: "Welcome | React Task Manager" },
      {
        name: "description",
        content:
          "Get started with React Task Manager - A modern task management application. Sign in to create, organize, and track your tasks efficiently.",
      },
    ]);
  });
});

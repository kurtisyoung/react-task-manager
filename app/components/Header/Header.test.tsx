import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./";
import "@testing-library/jest-dom";

// Mock useAuth and Link
const mockLogout = vi.fn();
let mockIsAuthenticated = false;

vi.mock("~/context/AuthContext", () => ({
  useAuth: () => ({
    logout: mockLogout,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

vi.mock("react-router", () => ({
  Link: ({
    to,
    className,
    onClick,
    children,
  }: {
    to: string;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
  }) => (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;
  });

  test("renders header with logo and title", () => {
    render(<Header />);

    const logo = screen.getByAltText("Aritzia");
    const title = screen.getByText("React Task Manager");

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/aritzia-logo.svg");
    expect(title).toBeInTheDocument();
    expect(title.tagName.toLowerCase()).toBe("h1");
  });

  test("does not show logout link when not authenticated", () => {
    render(<Header />);

    expect(screen.queryByText("Log Out")).not.toBeInTheDocument();
  });

  test("shows and handles logout link when authenticated", () => {
    // Set authenticated state
    mockIsAuthenticated = true;

    render(<Header />);

    const logoutLink = screen.getByText("Log Out");
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toHaveAttribute("href", "/");

    fireEvent.click(logoutLink);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

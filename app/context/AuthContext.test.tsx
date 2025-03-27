import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { simulateApiCall } from "~/utils/simulateApiCall";
import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react";

// Mock simulateApiCall
vi.mock("~/utils/simulateApiCall", () => ({
  simulateApiCall: vi.fn(),
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

// Test component that uses the auth context
function TestComponent() {
  const { isAuthenticated, login, logout } = useAuth();
  console.log("isAuthenticated", isAuthenticated);
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </div>
      <button
        onClick={async () => {
          try {
            await login("test@example.com", "password");
          } catch (error) {
            // Ignore error in test component
          }
        }}
      >
        Login
      </button>
      <button
        onClick={async () => {
          try {
            await logout();
          } catch (error) {
            // Ignore error in test component
          }
        }}
      >
        Logout
      </button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue(null);
  });

  test("provides initial unauthenticated state", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "Not Authenticated"
    );
  });

  test("initializes as authenticated if session storage has auth token", () => {
    mockSessionStorage.getItem.mockReturnValue("true");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "Authenticated"
    );
  });

  test("handles successful login", async () => {
    vi.mocked(simulateApiCall).mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Authenticated"
      );
    });

    expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
      "isAuthenticated",
      "true"
    );
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ email: "test@example.com", password: "password" })
    );
  });

  test("handles login failure with empty credentials", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await expect(result.current.login("", "")).rejects.toThrow(
      "Invalid credentials"
    );

    expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
  });

  test("handles successful logout", async () => {
    // Start as authenticated
    mockSessionStorage.getItem.mockReturnValue("true");
    vi.mocked(simulateApiCall).mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Not Authenticated"
      );
    });

    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
      "isAuthenticated"
    );
    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("user");
  });

  test("throws error when useAuth is used outside of AuthProvider", () => {
    // Suppress console.error for this test as we expect an error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );

    consoleSpy.mockRestore();
  });

  test("handles API errors during login", async () => {
    const apiError = new Error("API Error");
    vi.mocked(simulateApiCall).mockRejectedValueOnce(apiError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Not Authenticated"
      );
      expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  test("handles API errors during logout", async () => {
    // Start as authenticated
    mockSessionStorage.getItem.mockReturnValue("true");
    const apiError = new Error("API Error");
    vi.mocked(simulateApiCall).mockRejectedValueOnce(apiError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockSessionStorage.removeItem).not.toHaveBeenCalled();
    });
  });
});

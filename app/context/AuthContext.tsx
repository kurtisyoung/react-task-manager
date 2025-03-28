import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";
import { simulateApiCall } from "~/utils/simulateApiCall";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if sessionStorage is available
    return typeof sessionStorage !== "undefined"
      ? sessionStorage?.getItem("isAuthenticated") === "true"
      : false;
  });

  const login = async (email: string, password: string) => {
    // For assessment purposes accept any non-empty credentials
    if (email && password) {
      try {
        // Simulate API call for login
        await simulateApiCall("login", { email, password });
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("user", JSON.stringify({ email, password }));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Login failed:", error);
        throw new Error("Failed to login. Please try again.");
      }
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    try {
      // Simulate API call for logout
      await simulateApiCall("logout", {});
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("user");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Failed to logout. Please try again.");
    }
  };

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

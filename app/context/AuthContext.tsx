import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { simulateApiCall } from "~/utils/simulateApiCall";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return typeof sessionStorage !== "undefined"
      ? sessionStorage?.getItem("isAuthenticated") === "true"
      : false;
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // For assessment purposes, accept any non-empty credentials
    if (email && password) {
      // Simulate API call
      await simulateApiCall("login", { email, password });
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("user", JSON.stringify({ email, password }));
      setIsAuthenticated(true);
    } else {
      throw new Error("Invalid credentials");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await simulateApiCall("logout", {});
    } catch (error) {
      // Even if the API call fails, we still want to clear the session
      console.error("Logout API error:", error);
    }
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("user");
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout]
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

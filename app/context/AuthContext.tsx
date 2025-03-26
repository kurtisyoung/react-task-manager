import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
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

  const login = async (email: string, password: string) => {
    // Simulate API call
    await simulateApiCall("login", { email, password });

    // For assessment purposes, accept any non-empty credentials
    if (email && password) {
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("user", JSON.stringify({ email, password }));
      setIsAuthenticated(true);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    await simulateApiCall("logout", {});
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

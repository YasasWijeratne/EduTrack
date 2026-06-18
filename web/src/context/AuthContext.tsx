import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/user";
import { loginUser, registerUser, adminLogin as adminLoginService } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const saveUser = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    saveUser(data.user, data.token);
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const data = await registerUser(firstName, lastName, email, password);
    saveUser(data.user, data.token);
  };

  const adminLogin = async (email: string, password: string) => {
    const data = await adminLoginService(email, password);
    saveUser(data.user, data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
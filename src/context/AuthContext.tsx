import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  loggedIn: boolean;
  user: User | null;
  token: string | null; // <-- add this
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const [loggedIn, setLoggedIn] = useState(!!token);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setToken(token); // <-- save token in state
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null); // <-- clear token
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

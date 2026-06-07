import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { DEMO_USERS } from "@/data/demo";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("foodshare_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("foodshare_users");
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  useEffect(() => {
    if (user) localStorage.setItem("foodshare_user", JSON.stringify(user));
    else localStorage.removeItem("foodshare_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("foodshare_users", JSON.stringify(users));
  }, [users]);

  const login = (email: string, _password: string): boolean => {
    const found = users.find((u) => u.email === email);
    if (found) { setUser(found); return true; }
    return false;
  };

  const signup = (name: string, email: string, _password: string, role: UserRole): boolean => {
    if (users.find((u) => u.email === email)) return false;
    const newUser: User = { id: `u${Date.now()}`, name, email, role };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

import type { AuthContextValue, User } from "@/types";
import { apiFetch } from "@/utils/api";
import { createContext, useState, type ReactNode } from "react";

export const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  async function login(email: string, password: string) {
      const res = (await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })) as { user: User };
      setUser(res.user);
  }

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
    setUser(null);
  }

  async function register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    await login(email, password);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

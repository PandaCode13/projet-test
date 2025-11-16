import { useAuthStore } from "@/lib/store";
import type { AuthContextValue, User } from "@/types";
import { apiFetch } from "@/utils/api";
import { createContext, type ReactNode } from "react";
import { useNavigate } from "react-router";

export const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const res = (await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })) as { user: User };
    console.log(res);
    useAuthStore.getState().setUser(res.user);
  }

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" });
    navigate("/");
    useAuthStore.getState().logout();
  }

  async function register({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    await login({ email, password });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

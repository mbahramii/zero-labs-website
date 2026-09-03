"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  type TokenResponse,
  type UserOut,
  saveTokens,
  clearTokens,
  getAccessToken,
  getCurrentUser,
  logoutUser,
} from "@/lib/auth";

type AuthContextType = {
  user: UserOut | null;
  login: (tokens: TokenResponse) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      if (getAccessToken()) {
        try {
          const me = await getCurrentUser();
          setUser(me);
        } catch {
          clearTokens();
        }
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const login = async (tokens: TokenResponse) => {
    saveTokens(tokens);
    try {
      const me = await getCurrentUser();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      clearTokens();
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
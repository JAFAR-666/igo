import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { mobileApi, setMobileToken } from "../api/client";

type User = {
  id: string;
  mobile: string;
  fullName: string;
  email?: string | null;
  activeMode: "customer" | "worker";
  isWorkerEnabled: boolean;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  activeMode: "customer" | "worker";
  requestOtp: (mobile: string) => Promise<string>;
  verifyOtp: (mobile: string, otp: string, activeMode: "customer" | "worker") => Promise<void>;
  switchMode: (mode: "customer" | "worker") => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [pendingOtp, setPendingOtp] = useState("123456");

  useEffect(() => {
    setMobileToken(token);
  }, [token]);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(token),
    token,
    user,
    activeMode: user?.activeMode || "customer",
    async requestOtp(mobile: string) {
      const { data } = await mobileApi.post("/auth/request-otp", { mobile, fullName: "igo User" });
      setPendingOtp(data.demoOtp);
      return data.demoOtp;
    },
    async verifyOtp(mobile: string, otp: string, activeMode: "customer" | "worker") {
      const code = otp || pendingOtp;
      const { data } = await mobileApi.post("/auth/verify-otp", { mobile, otp: code, activeMode });
      setToken(data.accessToken);
      setUser(data.user);
    },
    switchMode(mode: "customer" | "worker") {
      if (!user) {
        return;
      }
      setUser({ ...user, activeMode: mode });
    },
  }), [pendingOtp, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

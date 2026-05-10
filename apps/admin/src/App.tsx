import { useEffect, useMemo, useState } from "react";
import { setAdminToken } from "./api/client";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  const initialToken = useMemo(() => localStorage.getItem("igo-admin-token"), []);
  const [token, setToken] = useState<string | null>(initialToken);

  useEffect(() => {
    setAdminToken(token);
  }, [token]);

  const handleLogin = (nextToken: string) => {
    localStorage.setItem("igo-admin-token", nextToken);
    setAdminToken(nextToken);
    setToken(nextToken);
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardPage />;
}

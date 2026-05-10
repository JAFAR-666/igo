import { useState } from "react";
import { apiClient, setAdminToken } from "../api/client";

type LoginPageProps = {
  onLogin: (token: string) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("admin@igo.app");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await apiClient.post("/auth/admin-login", { email, password });
      setAdminToken(data.accessToken);
      onLogin(data.accessToken);
    } catch (err) {
      setError("Unable to sign in. Check admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="eyebrow">igo Admin</span>
        <h1>Operations dashboard</h1>
        <p>Review worker verification, bookings, wages, and complaints from one place.</p>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
        {error ? <div className="error-banner">{error}</div> : null}
        <button disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

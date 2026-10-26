import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "../api/client";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); 
    setError(null);
    setLoading(true);
    try {
      const data = await api.post("/api/auth/login", { username, password });
      setToken(data.token);
      onLogin();
      navigate("/admin");
    } catch (err) {
      if ([400, 401, 403].includes(err.status)) {
        setError("Wrong account or password");
      } else {
        setError("No connection to server. Try again later");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="site">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="error-inline">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Login loading..." : "Login"}
        </button>
      </form>
    </main>
  );
}
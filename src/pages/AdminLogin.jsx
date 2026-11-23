import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      sessionStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-decoration login-decoration-one"></div>
      <div className="login-decoration login-decoration-two"></div>

      <form className="admin-login-form" onSubmit={handleLogin}>
        <Link to="/" className="login-logo">
          AD<span>.</span>
        </Link>

        <div className="login-heading">
          <p className="login-eyebrow">WELCOME BACK</p>
          <h1>
            Admin <span>Login.</span>
          </h1>
          <p>Sign in to manage your portfolio.</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="login-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoComplete="off"
            required
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">Password</label>

          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
          {!loading && <span>↗</span>}
        </button>

        <p className="login-footer">
          <span className="login-status-dot"></span>
          Secure administrator access
        </p>

        <Link to="/" className="back-to-portfolio">
          ← Back to portfolio
        </Link>
      </form>
    </div>
  );
}

export default AdminLogin;

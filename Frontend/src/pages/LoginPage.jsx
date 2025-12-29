import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://gym-management-system-r7oa.onrender.com/api/auth/login",
        { email, password }
      );

      const user = res.data.user || res.data;
      login(user, res.data.token);

      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "trainer") navigate("/trainer/dashboard");
      else navigate("/member/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-content">
        <div className="auth-form">
          <h2>Sign in</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>

            {error && <p className="error">{error}</p>}
            <p className="no-account">Don't have an account? Contact admin</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

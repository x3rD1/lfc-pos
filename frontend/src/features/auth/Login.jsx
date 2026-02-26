import { useContext, useState } from "react";
import { login } from "../../api/auth_api";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import AuthContext from "../../contexts/AuthContext";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const { user, refreshUser, loading, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(input);
      await refreshUser();
      navigate("/", { replace: true });
    } catch (error) {
      console.log("Login failed", error);
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div>
      {loading && <p>Loading...</p>}
      <h1>Welcome back</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={input.email}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={input.password}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Enter your email"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

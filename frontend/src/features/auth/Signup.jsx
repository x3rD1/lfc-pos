import { useContext, useState } from "react";
import { signup } from "../../api/auth_api";
import { Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import styles from "./Signup.module.css";

function Signup() {
  const { user, loading } = useContext(AuthContext);
  const [input, setInput] = useState({
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await signup(input);
      navigate("/login", { replace: true });
    } catch (error) {
      console.log("Signup failed", error);

      if (Array.isArray(error.errors)) {
        setErrors(error.errors);
      } else if (error.message) {
        setErrors([{ field: "_form", message: error.message }]);
      } else {
        setErrors([{ field: "_form", message: "Signup failed! Check logs" }]);
      }
    }
  };

  const getFieldError = (field) => {
    return errors.find((err) => err.field === field)?.message;
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div>
      {loading && <p>Loading...</p>}
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        {getFieldError("_form") && (
          <div className={styles.errorBanner}>{getFieldError("_form")}</div>
        )}

        <div>
          <label>Company:</label>
          <input
            type="text"
            value={input.company}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, company: e.target.value }))
            }
            placeholder="Enter company name"
            required
          />
          {getFieldError("company") && (
            <span className={styles.fieldError}>
              {getFieldError("company")}
            </span>
          )}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={input.email}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Enter your email"
            required
          />
          {getFieldError("email") && (
            <span className={styles.fieldError}>{getFieldError("email")}</span>
          )}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={input.password}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Create a password"
            required
          />
          {getFieldError("password") && (
            <span className={styles.fieldError}>
              {getFieldError("password")}
            </span>
          )}
        </div>
        <div>
          <label>Confirm password:</label>
          <input
            type="password"
            value={input.confirmPassword}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            placeholder="Confirm your password"
            required
          />
          {getFieldError("confirmPassword") && (
            <span className={styles.fieldError}>
              {getFieldError("confirmPassword")}
            </span>
          )}
        </div>
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}

export default Signup;

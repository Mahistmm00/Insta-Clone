import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import "./Login.css";
import { FacebookOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Toast from "../components/common/Toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setToast({ message: "Welcome back!", type: "success" });
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login">
      <img
        src="https://www.pngkey.com/png/full/828-8286178_mackeys-work-needs-no-elaborate-presentation-or-distracting.png"
        alt="Instagram Logo"
      />
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            value={email}
            className={errors.email ? 'error' : ''}
            aria-label="Email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="input-group password-group">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            className={errors.password ? 'error' : ''}
            aria-label="Password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </button>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className={`login-button ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <div className="or__section">
        <span>OR</span>
        <div className="with__face">
          <span style={{ fontWeight: "500" }}>
            <FacebookOutlined /> Log in with Facebook
          </span>

          <span>Forget password?</span>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Login;

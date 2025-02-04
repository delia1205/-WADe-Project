import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/context.js";
import "../styles/auth.css";

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { userData, login, register, error } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("userData updated:", userData);
    if (userData.email !== "") {
      console.log("Navigating to /query after successful login...");
      navigate("/query");
    }
  }, [userData, navigate]);

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email is required. ");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format. ");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!password) {
      setPasswordError("Password is required. ");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character. "
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password. ");
      return false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match. ");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register(username, email, password);
      setIsLogin(true);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <div className="auth-container">
        {isLogin ? (
          <p>Don't have an account? Click on Register.</p>
        ) : (
          <p>Already created an account? Click on Login.</p>
        )}
        <div className="tabs">
          <button
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        {isLogin ? (
          <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmitLogin}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="***************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="error">{error + emailError + passwordError}</div>
              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>
          </div>
        ) : (
          <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmitRegister}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={validateConfirmPassword}
                  required
                />
              </div>
              <div className="error">
                {emailError + passwordError + confirmPasswordError}
              </div>
              <button type="submit" className="submit-btn">
                Register
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

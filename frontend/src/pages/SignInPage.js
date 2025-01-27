import React, { useState } from "react";
import "../styles/auth.css";

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    console.log("login");
  };

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    console.log("register");
  };

  return (
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
          <form onSubmit={(e) => handleSubmitLogin(e)}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="form-container">
          <h2>Register</h2>
          <form onSubmit={(e) => handleSubmitRegister(e)}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

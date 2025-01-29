import React, { useState, createContext, useContext } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const getUserData = () => {
    const userDataString = localStorage.getItem("userData");
    return JSON.parse(userDataString) || { email: "" };
  };

  const [userData, setUserData] = useState(getUserData());
  const [error, setError] = useState("");

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3002/api/auth/signin",
        { username, password },
        { withCredentials: true }
      );
      const user = response.data;
      localStorage.setItem("userData", JSON.stringify(user));
      setUserData(user);
      console.log(user);

      setError("");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post("http://localhost:3002/api/auth/signup", {
        username,
        email,
        password,
      });
      alert("Signup successful! Please log in.");
      setError(""); // Clear any existing errors on successful registration
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("userData");
    setUserData({ email: "" });
    setError("");
  };

  return (
    <UserContext.Provider value={{ userData, login, register, logout, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserContextProvider");
  }
  return context;
};

export default UserContextProvider;

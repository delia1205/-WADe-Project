import React, { useState, createContext, useContext } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const getUserData = () => {
    const userDataString = localStorage.getItem("userData");
    return JSON.parse(userDataString) || { isLogged: false };
  };

  const [userData, setUserData] = useState(getUserData());

  const login = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    setUserData(data);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    setUserData({ isLogged: false });
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        login,
        logout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within an UserContextProvider");
  }
  return context;
};

export default UserContextProvider;

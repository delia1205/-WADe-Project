import React, { useState, createContext } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [userData, setUserData] = useState({
    username: "harry_potter",
    isLogged: false,
  });
  return (
    <UserContext.Provider
      value={{
        userData: userData,
        setUserData: setUserData,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;

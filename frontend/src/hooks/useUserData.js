import { useState } from "react";

export default function useUserData() {
  const getUserData = () => {
    const userDataString = localStorage.getItem("userData");
    const storedUserData = JSON.parse(userDataString);
    return storedUserData || { email: "", isLogged: false }; // Default values
  };

  const [userData, setUserData] = useState(getUserData());

  const saveUserData = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    setUserData(data);
  };

  const clearUserData = () => {
    localStorage.removeItem("userData");
    setUserData({ email: "", isLogged: false });
  };

  return {
    userData,
    setUserData: saveUserData,
    clearUserData,
  };
}

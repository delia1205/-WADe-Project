import { useState } from "react";

export default function useUserData() {
  const getUserData = () => {
    const userDataString = localStorage.getItem("userData");
    const storedUserData = JSON.parse(userDataString);
    return storedUserData || { email: "" };
  };

  const [userData, setUserData] = useState(getUserData());

  const saveUserData = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    setUserData(data);
  };

  const clearUserData = () => {
    localStorage.removeItem("userData");
    setUserData({ email: "" });
  };

  return {
    userData,
    setUserData: saveUserData,
    clearUserData,
  };
}

import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/context";

export default function UserProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    console.log("User signed out");
    logout();
    navigate("/");
  };

  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="centered">
        <Button
          classes={"white"}
          text={"Log out"}
          onClick={() => handleSignOut()}
        />
      </div>
    </>
  );
}

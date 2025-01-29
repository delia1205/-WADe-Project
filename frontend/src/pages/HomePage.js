import React from "react";
import "../styles/home.css";
import "../styles/navbar.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="home-centered">
        <div className="content">
          <div className="headline">
            Query GraphQL APIs with Natural Language – No Coding Required!
          </div>
          <div className="subtitle">
            Easily fetch data from APIs like GitHub and SpaceX using plain text
            or voice commands. Perfect for developers, analysts, and
            enthusiasts.
          </div>
          <Button
            classes="white"
            text="Start Querying Now"
            onClick={() => navigate("/query")}
          />
        </div>
      </div>
    </>
  );
}

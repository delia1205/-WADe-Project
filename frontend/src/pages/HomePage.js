import React from "react";
import "../styles/home.css";
import "../styles/navbar.css";
import Button from "../components/Button";

export default function HomePage() {
  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="centered">
        <div className="content">
          <div className="headline">
            Query GraphQL APIs with Natural Language – No Coding Required!
          </div>
          <div className="subtitle">
            Easily fetch data from APIs like GitHub and SpaceX using plain text
            or voice commands. Perfect for developers, analysts, and
            enthusiasts.
          </div>
          <Button classes="white" text="Start Querying Now" />
        </div>
      </div>
    </>
  );
}

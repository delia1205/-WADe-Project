import React from "react";
import "../styles/tutorial.css";
import ReactPlayer from "react-player";

export default function TutorialPage() {
  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="container">
        <div className="tut-title">Video tutorial for A&D's GAIT Project</div>
        <p>
          Here is how to use our platform demonstrated in a step-by-step, 5
          minute tutorial video, making it easy to navigate this website for
          everyone!
        </p>
        <div className="video">
          <ReactPlayer url="https://youtu.be/oeIdOVDBm40" />
        </div>
      </div>
    </>
  );
}

import React from "react";
import "../styles/tutorial.css";
import ReactPlayer from "react-player";

export default function TutorialPage() {
  return (
    <div className="container">
      <div className="title">Video tutorial for A&D's GAIT Project</div>
      <p>
        Here is how to use our platform demonstrated in a step-by-step, 5 minute
        tutorial video, making it easy to navigate this website for everyone!
      </p>
      <div className="video">
        <ReactPlayer url="https://youtu.be/dQw4w9WgXcQ?si=63wRTWRzwWsd7SFn" />
      </div>
    </div>
  );
}

import React from "react";

export default function NotFound() {
  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="home-centered">
        <div className="content">
          <div className="headline">Oops! Page Not Found.</div>
          <div className="subtitle">
            The page you’re looking for might have been moved, deleted, or
            doesn’t exist.
          </div>
        </div>
      </div>
    </>
  );
}

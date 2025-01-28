import React from "react";
import { mockData } from "../mockups/resultsData";
import "../styles/results.css";

export default function ResultsPage() {
  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <div className="results-container">
        <header className="header">
          <h1 className="results-title">Results for Your Query</h1>
          <p className="results-subtitle">
            <i>You searched for: "Latest SpaceX launches"</i>
          </p>
        </header>

        <main className="results-main">
          <div className="items-container">
            {mockData.map((item) => (
              <div key={item.id} className="item">
                <img src={item.image} alt={item.name} className="item-img" />
                <h2 className="item-name">{item.name}</h2>
                <p className="item-date">{item.date}</p>
                <p className="item-details">{item.details}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="item-link"
                >
                  Learn More
                </a>
              </div>
            ))}
          </div>
        </main>

        <section className="results-query-section">
          <h2 className="results-query">GraphQL Query</h2>
          <div className="results-query-schema">
            {`{
      launchesPast(limit: 3) {
        mission_name
        launch_date
        details
      }
    }`}
          </div>
          <p className="results-query-p">
            <i>
              This query retrieves the 3 most recent SpaceX launches along with
              their names, dates, and details.
            </i>
          </p>
        </section>

        <footer className="results-footer">
          <button className="results-button">Search Again</button>
          <button className="results-button">Export Results</button>
          <button className="results-button">Feedback</button>
        </footer>
      </div>
    </>
  );
}

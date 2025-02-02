import React, { useState, useEffect } from "react";
import "../styles/results.css";

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [query, setQuery] = useState(
    "{ launchesPast(limit: 5) { mission_name launch_date_local } }"
  );
  const [apiName, setApiName] = useState("spacex");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3003/graphql-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          api_name: apiName,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data && data.launchesPast) {
        setResults(data);
      } else {
        setError("No data found or incorrect data structure.");
      }
    } catch (error) {
      setError("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, apiName]);

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
            <i>You searched for: "{query}"</i>
          </p>
        </header>

        <main className="results-main">
          <div className="items-container">
            {loading ? (
              <p>Loading results...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : results && results.launchesPast ? (
              results.launchesPast.map((item, index) => (
                <div key={index} className="item">
                  <h2 className="item-name">{item.mission_name}</h2>
                  <p className="item-date">
                    {new Date(item.launch_date_local).toLocaleString()}
                  </p>
                  <p className="item-details">
                    {item.details || "No details available"}
                  </p>
                  <a
                    href={`https://spacex.com/launches/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="item-link"
                  >
                    Learn More
                  </a>
                </div>
              ))
            ) : (
              <p>No results found for your query.</p>
            )}
          </div>
        </main>

        <section className="results-query-section">
          <h2 className="results-query">GraphQL Query</h2>
          <div className="results-query-schema">{query}</div>
          <p className="results-query-p">
            <i>
              This query retrieves the 3 most recent SpaceX launches along with
              their names, dates, and details.
            </i>
          </p>
        </section>

        <footer className="results-footer">
          <button
            className="results-button"
            onClick={() => window.location.reload()}
          >
            Search Again
          </button>
          <button className="results-button">Export Results</button>
          <button className="results-button">Feedback</button>
        </footer>
      </div>
    </>
  );
}

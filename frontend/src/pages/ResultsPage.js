import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/results.css";

export default function ResultsPage() {
  const location = useLocation();
  const { results, query, gql, query_uri } = location.state || {
    results: null,
    query: "",
    gql: "",
    query_uri: "",
  };
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    if (!results || !results.response) return;

    setExporting(true);

    const data = results.response.data || results.response.countries;

    try {
      const response = await fetch("http://localhost:5000/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data,
          format: format,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to export results");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `exported_results.${format}`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("There was an error exporting the results.");
    } finally {
      setExporting(false);
    }
  };

  const renderResults = () => {
    if (!results) {
      return <p className="loading-message">Loading results...</p>;
    }

    if (
      results.response &&
      results.response.data &&
      results.response.data.country
    ) {
      const country = results.response.data.country;
      return (
        <div className="item">
          <h2 className="item-name">{country.name}</h2>
          <p className="item-details">
            <strong>Capital:</strong> {country.capital}
          </p>
          <p className="item-details">
            <strong>Currency:</strong> {country.currency}
          </p>
          <p className="item-details">
            <strong>Languages:</strong>{" "}
            {country.languages.map((lang) => lang.name).join(", ")}
          </p>
          <a
            href={`https://www.google.com/maps/search/${country.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="item-link"
          >
            Learn More
          </a>
        </div>
      );
    }

    if (
      results.response &&
      results.response.countries &&
      results.response.countries.length > 0
    ) {
      return (
        <div className="items-container">
          {results.response.countries.map((country) => (
            <div className="item" key={country.code}>
              <h2 className="item-name">{country.name}</h2>
              <p className="item-details">
                <strong>Continent:</strong> {country.continent.name}
              </p>
              <a
                href={`https://www.google.com/maps/search/${country.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="item-link"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      );
    }

    return <p className="error-message">No results found for the country.</p>;
  };

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

        <section className="results-query-section">
          <h3 className="results-query">
            The shareable link for this query and results:
          </h3>
          <div className="results-query-schema">{query_uri}</div>
        </section>

        <main className="results-main">
          <div className="items-container">{renderResults()}</div>
        </main>

        <section className="results-query-section">
          <h2 className="results-query">GraphQL Query</h2>
          <div className="results-query-schema">{gql}</div>
          <p className="results-query-p">
            <i>This query retrieves the following data: {query}</i>
          </p>
        </section>

        <footer className="results-footer">
          <button
            className="results-button"
            onClick={() => window.location.reload()}
          >
            Search Again
          </button>
          <button
            className="results-button"
            onClick={() => handleExport("csv")}
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "Export as CSV"}
          </button>
          <button
            className="results-button"
            onClick={() => handleExport("json")}
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "Export as JSON"}
          </button>
          <button className="results-button">Feedback</button>
        </footer>
      </div>
    </>
  );
}

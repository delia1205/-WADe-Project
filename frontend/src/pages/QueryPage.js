import React, { useState } from "react";
import "../styles/query.css";

function QueryPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:3000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="query-container">
        <h1 className="query-title">GAIT - GraphQL API Interactive Tool</h1>
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          rows="5"
        />
        <button className="query-button" onClick={handleVoiceInput}>
          🎤 Voice Input
        </button>
        <button className="query-button" onClick={handleSubmit}>
          Submit
        </button>
        {
          //  TODO: redirect to a new page for results and remove this
          result && <pre>{JSON.stringify(result, null, 2)}</pre>
        }
      </div>
    </>
  );
}

export default QueryPage;

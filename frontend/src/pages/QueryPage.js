import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/query.css";

function QueryPage() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState(i18n.language);
  const navigate = useNavigate();

  const handleInputChange = (e) => setInput(e.target.value);

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      console.log("data:", data);
      navigate("/result", {
        state: {
          results: data,
          query: input,
          gql: data.query,
          query_uri: data.link,
        },
      });
    } catch (error) {
      console.error("Error fetching query results:", error);
    }
  };

  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="query-container">
        <h1 className="query-title">
          {t("GraphQL Natural Language Query Tool")}
        </h1>

        {/* Language Selector */}
        <select
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          value={language}
        >
          <option value="en">🇬🇧 English</option>
          <option value="ro">🇷🇴 Română</option>
          <option value="de">🇩🇪 Deutsch</option>
        </select>

        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder={t("Type your query here...")}
          rows="5"
        />
        <button className="query-button" onClick={handleVoiceInput}>
          🎤 {t("Voice Input")}
        </button>
        <button className="query-button" onClick={handleSubmit}>
          {t("Submit")}
        </button>
      </div>
    </>
  );
}

export default QueryPage;

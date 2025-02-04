import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserContext } from "../hooks/context";
import "../styles/query.css";

function QueryPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [input, setInput] = useState(location.state?.oldPrompt || "");
  const [language, setLanguage] = useState(i18n.language);
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleVoiceInput = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = i18n.language;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input, user_id: userData._id }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
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

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
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
          className="language-select"
          onChange={handleLanguageChange}
          value={i18n.language}
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

import { useState, useEffect } from "react";
import QueryInput from "./components/QueryInput";
import ResultDisplay from "./components/ResultDisplay";
import RdfViewer from "./components/RdfViewer";
import "./i18n";
import { useTranslation } from "react-i18next";

const App = () => {
    const { t, i18n } = useTranslation(); //  Hook for translations
    const [results, setResults] = useState(null);
    const [storedQueries, setStoredQueries] = useState([]); //  Store query URLs
    const [language, setLanguage] = useState(i18n.language); //  Track selected language

    //  Fetch stored queries when the app loads OR language changes
    useEffect(() => {
        fetchStoredQueries();
    }, [language]); //  Force update on language change

    //  Force React to re-render when language changes
    useEffect(() => {
        const handleLanguageChange = () => setLanguage(i18n.language);
        i18n.on("languageChanged", handleLanguageChange);
        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, []);

    const fetchStoredQueries = async () => {
        try {
            const response = await fetch("http://localhost:5001/queries");
            const data = await response.json();
            if (!data.error) {
                setStoredQueries(data);
            }
        } catch (error) {
            console.error("Error fetching stored queries:", error);
        }
    };

    const handleQuerySubmit = async (query) => {
        try {
            const response = await fetch("http://localhost:5000/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_input: query }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            setResults(data);

            //  Fetch updated queries after new submission
            fetchStoredQueries();
        } catch (error) {
            console.error("Error fetching query results:", error);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>{t("GraphQL Natural Language Query Tool")}</h1>
            
            {/* Language Selector */}
            <select
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                value={language}
                style={{ marginBottom: "10px" }}
            >
                <option value="en">🇬🇧 English</option>
                <option value="ro">🇷🇴 Română</option>
                <option value="de">🇩🇪 Deutsch</option>
            </select>

            <QueryInput onQuerySubmit={handleQuerySubmit} />
            {results && <ResultDisplay results={results} />}
            <RdfViewer />

            <h2>{t("Stored Queries")}</h2>
            <div>
                {storedQueries.length === 0 ? (
                    <p>{t("No stored queries found.")}</p>
                ) : (
                    storedQueries.map((query, index) => (
                        <button
                            key={index}
                            onClick={() => window.open(query.queryID, "_blank")}
                            style={{
                                display: "block",
                                margin: "10px 0",
                                padding: "10px",
                                cursor: "pointer",
                                background: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px"
                            }}
                        >
                            {t("Open Query")} {index + 1}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default App;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "GraphQL Natural Language Query Tool": "GraphQL Natural Language Query Tool",
            "Submit": "Submit",
            "🎤 Voice Input": "🎤 Voice Input",
            "Stored Queries": "Stored Queries",
            "No stored queries found.": "No stored queries found.",
            "Open Query": "Open Query"
        }
    },
    ro: {
        translation: {
            "GraphQL Natural Language Query Tool": "Instrument de interogare a limbajului natural GraphQL",
            "Submit": "Trimite",
            "🎤 Voice Input": "🎤 Intrare vocală",
            "Stored Queries": "Interogări salvate",
            "No stored queries found.": "Nu s-au găsit interogări salvate.",
            "Open Query": "Deschide interogarea"
        }
    },
    de: {
        translation: {
            "GraphQL Natural Language Query Tool": "GraphQL-Natürliche-Sprachabfrage-Tool",
            "Submit": "Absenden",
            "🎤 Voice Input": "🎤 Spracheingabe",
            "Stored Queries": "Gespeicherte Abfragen",
            "No stored queries found.": "Keine gespeicherten Abfragen gefunden.",
            "Open Query": "Abfrage öffnen"
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en", // Default language is English
    fallbackLng: "en", // If language is missing, fallback to English
    interpolation: {
        escapeValue: false
    }
});

export default i18n;

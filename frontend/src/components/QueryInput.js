import { useState } from "react";

const QueryInput = ({ onQuerySubmit }) => {
    const [query, setQuery] = useState("");

    const handleVoiceInput = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.onresult = (event) => {
            setQuery(event.results[0][0].transcript);
        };
        recognition.start();
    };

    return (
        <div>
            <textarea 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Ask a question..."
            />
            <button onClick={() => onQuerySubmit(query)}>Submit</button>
            <button onClick={handleVoiceInput}>🎤 Voice Input</button>
        </div>
    );
};

export default QueryInput;
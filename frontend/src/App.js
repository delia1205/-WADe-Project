import React, { useState } from 'react';

function App() {
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
        const response = await fetch('http://localhost:3000/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input }),
        });
        const data = await response.json();
        setResult(data);
    };

    return (
        <div>
            <h1>GAIT - GraphQL API Interactive Tool</h1>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your query heree..."
            />
            <button onClick={handleVoiceInput}>🎤 Voice Input</button>
            <button onClick={handleSubmit}>Submit</button>
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
}

export default App;


import React, { useState } from 'react';
import axios from 'axios';

function SPARQLQueryBuilder() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);

    const executeQuery = async () => {
        try {
            const response = await axios.post('/sparql', { query });
            setResults(response.data);
        } catch (error) {
            console.error('Error executing query:', error);
        }
    };

    return (
        <div>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Write your SPARQL query here"
                rows={10}
                cols={80}
            />
            <button onClick={executeQuery}>Run Query</button>
            {results && (
                <pre>{JSON.stringify(results, null, 2)}</pre>
            )}
        </div>
    );
}

export default SPARQLQueryBuilder;
                
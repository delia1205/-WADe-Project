import React, { useState } from "react";

const RdfViewer = () => {
    const [format, setFormat] = useState("turtle");
    const [rdfData, setRdfData] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRdfData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5001/rdf?format=${format}`);
            if (!response.ok) {
                throw new Error("Failed to load RDF data");
            }
            const data = await response.text();
            setRdfData(data);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleDownload = () => {
        const blob = new Blob([rdfData], { type: format === "json-ld" ? "application/json" : "text/turtle" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rdf_data.${format === "json-ld" ? "json" : "ttl"}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>RDF Data Viewer</h2>
            <label>Choose Format:</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ marginLeft: "10px" }}>
                <option value="turtle">Turtle (.ttl)</option>
                <option value="json-ld">JSON-LD (.json)</option>
            </select>
            <button onClick={fetchRdfData} style={{ marginLeft: "10px", padding: "8px 12px", cursor: "pointer" }}>
                🔄 Load RDF
            </button>
            <button onClick={handleDownload} disabled={!rdfData} style={{ marginLeft: "10px", padding: "8px 12px", cursor: "pointer" }}>
                ⬇ Download RDF
            </button>
            <button onClick={() => window.open(`http://localhost:5001/rdf?format=${format}`)}
                style={{ marginLeft: "10px", padding: "8px 12px", cursor: "pointer" }}>
                🔗 Open RDF in New Tab
            </button>

            {loading && <p>Loading RDF data...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {rdfData && (
                <pre style={{
                    whiteSpace: "pre-wrap",
                    background: "#f4f4f4",
                    padding: "10px",
                    borderRadius: "5px",
                    marginTop: "10px",
                    overflowX: "auto"
                }}>
                    {rdfData}
                </pre>
            )}
        </div>
    );
};

export default RdfViewer;

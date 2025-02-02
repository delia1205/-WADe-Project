const ResultDisplay = ({ results }) => {
    return (
        <div>
            <h3>Query Results</h3>
            <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
    );
};

export default ResultDisplay;

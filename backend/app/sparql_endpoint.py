from flask import Flask, request, jsonify, Response
from rdf_store import RDFStore
from flask_cors import CORS

app = Flask(__name__)
rdf_store = RDFStore()
CORS(app)

@app.route('/sparql', methods=['POST'])
def sparql_query():
    """Accept a SPARQL query and return results from the RDF store."""
    query = request.json.get('query', '')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        results = rdf_store.execute_sparql_query(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/rdf', methods=['GET'])
def get_rdf():
    """Retrieve the full RDF file content in Turtle or JSON-LD format."""
    format = request.args.get("format", "turtle")

    rdf_content = rdf_store.get_rdf_content(format)

    if not rdf_content:
        return jsonify({"error": "No RDF data found"}), 404

    mimetype = "text/turtle" if format == "turtle" else "application/ld+json"

    return Response(rdf_content, mimetype=mimetype)


@app.route('/query/<query_uri>', methods=['GET'])
def get_query_by_uri(query_uri):
    """Retrieve a stored query by its query_uri from MongoDB."""

    result = rdf_store.collection.find_one({"query_uri": query_uri}, {"_id": 0, "user_id": 0})  # Exclude MongoDB `_id` field

    if not result:
        return jsonify({"error": "Query URI not found"}), 404

    return jsonify(result)


@app.route('/queries', methods=['GET'])
def get_queries():
    """Retrieve all stored query URIs from MongoDB."""

    results = list(rdf_store.collection.find({}, {"query_uri": 1, "_id": 0}))  # Fetch all query URIs

    if not results:
        return jsonify({"error": "No query URIs found"}), 404

    return jsonify([
        {"queryURI": f"http://localhost:5001/query/{row['query_uri']}"} for row in results if "query_uri" in row
    ])




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

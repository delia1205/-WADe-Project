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

@app.route('/query/<query_id>', methods=['GET'])
def get_query_by_id(query_id):
    """Retrieve a stored query by its queryID."""
    sparql_query = f"""
    PREFIX ex: <http://example.org/queries#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?userQuery ?graphqlQuery ?response
    WHERE {{
      ?query ex:queryID "{query_id}"^^xsd:string ;
             ex:userQuery ?userQuery ;
             ex:graphqlQuery ?graphqlQuery ;
             ex:response ?response .
    }}
    """
    print(sparql_query)
    results = rdf_store.execute_sparql_query(sparql_query)

    if not results:
        return jsonify({"error": "Query ID not found"}), 404

    return jsonify([
        {
            "queryID": query_id,
            "userQuery": str(row["userQuery"]),
            "graphqlQuery": str(row["graphqlQuery"]),
            "response": str(row["response"]),
        }
        for row in results
    ])

@app.route('/queries', methods=['GET'])
def get_queries():
    """Retrieve all stored query IDs and their GraphQL queries."""

    sparql_query = """
    PREFIX ex: <http://example.org/queries#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?queryID
    WHERE {
        ?query ex:queryID ?queryID .
    }
    """


    print(sparql_query)  #  Debugging: Check the generated SPARQL query
    results = rdf_store.execute_sparql_query(sparql_query)
    print(results)

    if not results:
        return jsonify({"error": "No query IDs found"}), 404  #  More accurate error message

    return jsonify([
        {
            "queryID": "http://localhost:5001/query/" + str(row["queryID"]),
        }
        for row in results
    ])




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

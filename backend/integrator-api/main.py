from flask import Flask, request, jsonify
from flask_cors import CORS 
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph
from flasgger import Swagger


app = Flask(__name__)
CORS(app)

app.config['SWAGGER'] = {
    "title": "API Integrator",
    "description": "A tool to interact with GraphQL, SPARQL, and RDF APIs.",
    "version": "1.0.0",
    "termsOfService": "",
    "uiversion": 3
}
swagger = Swagger(app)


def make_graphql_request(api_url, query):
    transport = RequestsHTTPTransport(url=api_url)
    client = Client(transport=transport, fetch_schema_from_transport=True)
    gql_query = gql(query)
    response = client.execute(gql_query)
    return response


def make_sparql_request(endpoint_url, query):
    sparql = SPARQLWrapper(endpoint_url)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    response = sparql.query().convert()
    return response


def process_rdf(data, format="json-ld"):
    graph = Graph()
    graph.parse(data=data, format=format)
    return graph.serialize(format="json-ld")


@app.route('/graphql-query', methods=['POST'])
def handle_graphql_query():
    """
    Handle GraphQL queries for supported APIs.
    ---
    tags:
      - GraphQL
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            query:
              type: string
              description: The GraphQL query to execute.
            api_name:
              type: string
              description: The name of the API to query (e.g., spacex, countries, tmdb).
          example:
            query: "{ launchesPast(limit: 5) { mission_name launch_date_local } }"
            api_name: "spacex"
    responses:
      200:
        description: The result of the GraphQL query.
      400:
        description: Missing query or api_name.
    """
    data = request.json
    query = data.get('query')
    api_name = data.get('api_name')

    if not query or not api_name:
        return jsonify({"error": "Missing query or api_name"}), 400

    # Determine which API to call
    if api_name == "spacex":
        api_url = "https://spacex-production.up.railway.app/"
        response = make_graphql_request(api_url, query)
    elif api_name == "countries":
        api_url = "https://countries.trevorblades.com/"
        response = make_graphql_request(api_url, query)
    elif api_name == "tmdb":
        api_url = "https://tmdb-api.saeris.io/.netlify/functions/tmdb-api"
        response = make_graphql_request(api_url, query)
    elif api_name == "custom_rdf":
        rdf_data = data.get('rdf_data')
        response = process_rdf(rdf_data)
    else:
        return jsonify({"error": "Unsupported API"}), 400

    return jsonify(response)


@app.route('/sparql-query', methods=['POST'])
def handle_sparql_query():
    """
    Handle SPARQL queries for supported APIs.
    ---
    tags:
      - SPARQL
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            query:
              type: string
              description: The SPARQL query to execute.
            api_name:
              type: string
              description: The name of the API to query (e.g., dbpedia).
          example:
            query: "SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object } LIMIT 10"
            api_name: "dbpedia"
    responses:
      200:
        description: The result of the SPARQL query.
      400:
        description: Missing query or api_name.
    """
    data = request.json
    query = data.get('query')
    api_name = data.get('api_name')

    if not query or not api_name:
        return jsonify({"error": "Missing query or api_name"}), 400

    if api_name == "dbpedia":
        sparql_endpoint = "http://dbpedia.org/sparql"
        response = make_sparql_request(sparql_endpoint, query)
    else:
        return jsonify({"error": "Unsupported API"}), 400

    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True, port=3003)

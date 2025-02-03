from rdflib import Graph, Namespace, URIRef, Literal, XSD
from rdflib.namespace import RDF
import uuid
import os

#  Define Namespaces
EX = Namespace("http://example.org/queries#")

class RDFStore:
    def __init__(self, rdf_file="queries.ttl"):
        """Load RDF data from `queries.ttl` at startup."""
        self.graph = Graph()
        self.rdf_file = os.path.abspath(os.path.join(os.path.dirname(__file__), rdf_file))
        self.graph.bind("ex", EX)  #  Bind custom namespace

        #  Load RDF data if the file exists
        if os.path.exists(self.rdf_file) and os.path.getsize(self.rdf_file) > 0:
            print(f"Loading RDF from {self.rdf_file}")
            self.graph.parse(self.rdf_file, format="turtle")
        else:
            print(f"⚠ No RDF data found in {self.rdf_file}, initializing empty RDF graph.")

    def add_query_result(self, user_input, query, response):
        """Store or update a query's execution count and unique ID in RDF format."""
        query_hash = hash(user_input)  #  Generate a unique identifier
        query_uri = URIRef(f"{EX}query_{query_hash}")

        #  Check if the query already exists
        existing_query_id = None
        for qid in self.graph.objects(query_uri, EX.queryID):
            existing_query_id = str(qid)

        #  If the query exists, reuse the query ID; otherwise, generate a new one
        new_query_id = existing_query_id if existing_query_id else str(uuid.uuid4())

        #  Remove old triples to prevent duplicates
        self.graph.remove((query_uri, None, None))

        #  Store the new query data
        self.graph.add((query_uri, RDF.type, EX.Query))
        self.graph.add((query_uri, EX.queryID, Literal(new_query_id, datatype=XSD.string)))  
        self.graph.add((query_uri, EX.userQuery, Literal(user_input, datatype=XSD.string)))
        self.graph.add((query_uri, EX.graphqlQuery, Literal(query, datatype=XSD.string)))
        self.graph.add((query_uri, EX.response, Literal(response, datatype=XSD.string)))

        self.save_to_file()  #  Save after updating RDF

        return query_uri

    def save_to_file(self):
        """Save RDF data to a Turtle file."""
        with open(self.rdf_file, "w") as f:
            f.write(self.graph.serialize(format="turtle"))

    def execute_sparql_query(self, sparql_query):
        """Run a SPARQL query on stored RDF data and return results."""
        results = self.graph.query(sparql_query)
            #  Use results.vars to get variable names
        var_names = [str(var) for var in results.vars]

        return [
            {var_names[i]: str(value) for i, value in enumerate(row)}
            for row in results
        ]

    def get_rdf_content(self, format="turtle"):
        """Return RDF content in Turtle or JSON-LD format."""
        self.graph.parse(self.rdf_file, format="turtle")
        if format == "json-ld":
            return self.graph.serialize(format="json-ld", indent=2)
        return self.graph.serialize(format="turtle")

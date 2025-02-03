from rdflib import Graph, Namespace, URIRef, Literal, XSD
from rdflib.namespace import RDF
import uuid
from pymongo import MongoClient

# Define Namespaces
EX = Namespace("http://example.org/queries#")

class RDFStore:
    def __init__(self, mongo_uri="mongodb+srv://delia1205:hQ4DzmfkDU1DqKHZ@cluster0.nkus6.mongodb.net/", db_name="test", collection_name="queries"):
        """Initialize MongoDB connection and RDF graph."""
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]
        self.graph = Graph()
        self.graph.bind("ex", EX)

        # Load existing RDF data from MongoDB (if necessary)
        self.load_from_mongo()

    def load_from_mongo(self):
        """Load RDF data from MongoDB into the in-memory graph."""
        self.graph = Graph()  # Clear the current graph
        for doc in self.collection.find():
            self.graph.parse(data=doc["rdf"], format="turtle")

    def add_query_result(self, user_input, query, response, user_id=None):
        """Store or update a query's execution count and unique ID in MongoDB."""
        query_hash = hash(user_input)  # Generate a unique identifier
        query_uri = URIRef(f"{EX}query_{query_hash}")

        # **Clear any old data related to this query URI** before adding new data
        self.graph.remove((query_uri, None, None))

        # Generate unique query ID (if necessary)
        existing_query = self.collection.find_one({"query_uri": str(query_uri), "user_id": user_id})  # Filter by user_id
        query_id = existing_query["query_id"] if existing_query else str(uuid.uuid4())

        # Store new query data in RDF graph
        self.graph.add((query_uri, RDF.type, EX.Query))
        self.graph.add((query_uri, EX.queryID, Literal(query_id, datatype=XSD.string)))
        self.graph.add((query_uri, EX.userQuery, Literal(user_input, datatype=XSD.string)))
        self.graph.add((query_uri, EX.graphqlQuery, Literal(query, datatype=XSD.string)))
        self.graph.add((query_uri, EX.response, Literal(response, datatype=XSD.string)))

        # If user_id is provided, store it in the RDF graph
        if user_id:
            self.graph.add((query_uri, EX.userID, Literal(user_id, datatype=XSD.string)))

        # Save RDF to MongoDB
        self.save_to_mongo()

        return query_id

    def save_to_mongo(self):
        """Save the current RDF graph to MongoDB."""
        rdf_data = self.graph.serialize(format="turtle")
        self.collection.delete_many({})  # Clear existing data
        self.collection.insert_one({"rdf": rdf_data})


    def execute_sparql_query(self, sparql_query):
        """Run a SPARQL query on the RDF graph and return results."""
        results = self.graph.query(sparql_query)
        var_names = [str(var) for var in results.vars]

        return [{var_names[i]: str(value) for i, value in enumerate(row)} for row in results]

    def get_rdf_content(self, format="turtle"):
        """Return RDF content from MongoDB in the requested format."""
        self.load_from_mongo()  # Reload RDF graph from MongoDB
        return self.graph.serialize(format=format)


# from rdflib import Graph, Namespace, URIRef, Literal, XSD
# from rdflib.namespace import RDF
# import uuid
# import os

# #  Define Namespaces
# EX = Namespace("http://example.org/queries#")

# class RDFStore:
#     def __init__(self, rdf_file="queries.ttl"):
#         """Load RDF data from `queries.ttl` at startup."""
#         self.graph = Graph()
#         self.rdf_file = os.path.abspath(os.path.join(os.path.dirname(__file__), rdf_file))
#         self.graph.bind("ex", EX)  #  Bind custom namespace

#         #  Load RDF data if the file exists
#         if os.path.exists(self.rdf_file) and os.path.getsize(self.rdf_file) > 0:
#             print(f"Loading RDF from {self.rdf_file}")
#             self.graph.parse(self.rdf_file, format="turtle")
#         else:
#             print(f"⚠ No RDF data found in {self.rdf_file}, initializing empty RDF graph.")

#     def add_query_result(self, user_input, query, response):
#         """Store or update a query's execution count and unique ID in RDF format."""
#         query_hash = hash(user_input)  #  Generate a unique identifier
#         query_uri = URIRef(f"{EX}query_{query_hash}")

#         #  Check if the query already exists
#         existing_query_id = None
#         for qid in self.graph.objects(query_uri, EX.queryID):
#             existing_query_id = str(qid)

#         #  If the query exists, reuse the query ID; otherwise, generate a new one
#         new_query_id = existing_query_id if existing_query_id else str(uuid.uuid4())

#         #  Remove old triples to prevent duplicates
#         self.graph.remove((query_uri, None, None))

#         #  Store the new query data
#         self.graph.add((query_uri, RDF.type, EX.Query))
#         self.graph.add((query_uri, EX.queryID, Literal(new_query_id, datatype=XSD.string)))  
#         self.graph.add((query_uri, EX.userQuery, Literal(user_input, datatype=XSD.string)))
#         self.graph.add((query_uri, EX.graphqlQuery, Literal(query, datatype=XSD.string)))
#         self.graph.add((query_uri, EX.response, Literal(response, datatype=XSD.string)))

#         self.save_to_file()  #  Save after updating RDF

#         return new_query_id

#     def save_to_file(self):
#         """Save RDF data to a Turtle file."""
#         with open(self.rdf_file, "w") as f:
#             f.write(self.graph.serialize(format="turtle"))

#     def execute_sparql_query(self, sparql_query):
#         """Run a SPARQL query on stored RDF data and return results."""
#         results = self.graph.query(sparql_query)
#             #  Use results.vars to get variable names
#         var_names = [str(var) for var in results.vars]

#         return [
#             {var_names[i]: str(value) for i, value in enumerate(row)}
#             for row in results
#         ]

#     def get_rdf_content(self, format="turtle"):
#         """Return RDF content in Turtle or JSON-LD format."""
#         self.graph.parse(self.rdf_file, format="turtle")
#         if format == "json-ld":
#             return self.graph.serialize(format="json-ld", indent=2)
#         return self.graph.serialize(format="turtle")

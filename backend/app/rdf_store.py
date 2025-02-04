from rdflib import Graph, Namespace, URIRef, Literal, XSD
from rdflib.namespace import RDF
import uuid
from pymongo import MongoClient
import json
import ast

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
        self.graph = Graph() 

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

        return query_id

    def save_to_mongo(self, query_uri, user_id):
        """Save the current RDF graph to MongoDB."""
        rdf_data = self.graph.serialize(format="turtle")
        self.collection.insert_one({
            "rdf": rdf_data,
            "query_uri": str(query_uri),
            "user_id": str(user_id)
        })


    def execute_sparql_query(self, sparql_query):
        """Fetch query results from MongoDB instead of executing SPARQL on RDF graph."""
        
        # Extract queryID from the SPARQL query (since SPARQL isn't used anymore)
        if 'queryID' in sparql_query:
            query_id = sparql_query.split('"')[1]  # Extract queryID from the string
            results = self.collection.find_one({"query_id": query_id})

            if results:
                return [{
                    "queryID": results["query_id"],
                    "userQuery": results["userQuery"],
                    "graphqlQuery": results["graphqlQuery"],
                    "response": results["response"],
                }]
        
        return []


    def get_rdf_content(self, format="turtle"):
        """Retrieve RDF content from MongoDB instead of in-memory graph."""
        rdf_data_list = self.collection.find({}, {"rdf": 1, "_id": 0})  # Get only RDF data

        if not rdf_data_list:
            return None  # No data found

        rdf_content = "\n".join(doc["rdf"] for doc in rdf_data_list if "rdf" in doc)
        
        return rdf_content

    def get_query_history(self, user_id):
        """Fetch the query history for a specific user by user_id from MongoDB."""
        query_history = []
        
        documents = list(self.collection.find({"user_id": user_id}))
        
        if not documents:
            return {"message": f"No query history found for user_id {user_id}."}
        
        for doc in documents:
            rdf_data = doc["rdf"]
            
            graph = Graph()
            graph.parse(data=rdf_data, format="turtle")

            sparql_query = """
            PREFIX ns1: <http://example.org/queries#>

            SELECT ?queryID ?userQuery ?graphqlQuery ?response
            WHERE {
            ?query ns1:queryID ?queryID .
            ?query ns1:userQuery ?userQuery .
            ?query ns1:graphqlQuery ?graphqlQuery .
            ?query ns1:response ?response .
            }
            """
            
            results = graph.query(sparql_query)
            var_names = [str(var) for var in results.vars]
            
            query_results = [{var_names[i]: str(value) for i, value in enumerate(row)} for row in results]
            
            if query_results:
                query_history.extend(query_results)
        
        return {"user_id": user_id, "query_history": query_history}

    def delete_query_by_id(self, query_id):
        """Delete a specific query entry by queryID."""
        result = self.collection.delete_one({"query_uri": query_id})
        
        if result.deleted_count > 0:
            return {"message": f"Query with ID {query_id} deleted successfully."}
        else:
            return {"error": f"No query found with ID {query_id}."}

    def delete_all_queries_by_user(self, user_id):
        """Delete all query entries for a specific user_id."""
        result = self.collection.delete_many({"user_id": user_id})
        
        if result.deleted_count > 0:
            return {"message": f"All queries for user ID {user_id} deleted successfully."}
        else:
            return {"error": f"No queries found for user ID {user_id}."}


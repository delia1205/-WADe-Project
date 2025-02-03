import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import spacy
from app.graphql_client import GraphQLClient
from app.nlp_engine import NLPProcessor
from app.rdf_store import RDFStore  #  Import RDF storage module

# Initialize FastAPI
app = FastAPI()
rdf_store = RDFStore()

nlp_pipeline = pipeline("text2text-generation", model="t5-small")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (use specific domains in production)
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Allow these methods
    allow_headers=["*"],  # Allow all headers
)

# Load NLP model (Spacy)
nlp = NLPProcessor()

#  Define the correct request model
class QueryRequest(BaseModel):
    user_input: str  # Ensure it matches the frontend key

# GraphQL API Clients (Add more APIs here)
graphql_clients = {
    "countries": GraphQLClient("https://countries.trevorblades.com/"),
}


@app.post("/query")
def process_query(request: QueryRequest):
    """Receives a natural language query and executes GraphQL dynamically."""
    user_query = request.user_input
    parsed_query = nlp.process_query(user_query)
    api_name = parsed_query["api"]
    extracted_entities = parsed_query["entities"]

    if api_name not in graphql_clients:
        return {"error": "Invalid API selected"}

    #  Use detected country code or fallback to None
    country_code = extracted_entities[0] if extracted_entities else None

    if api_name == "countries":
        if not country_code:
            return {"error": "Could not detect a country in your question."}
        
        gql_query = f"""
        {{
          country(code: "{country_code}") {{
            name
            capital
            currency
            languages {{
              name
            }}
          }}
        }}
        """
    else:
        return {"error": "Could not figure out API used"}

    #  Execute GraphQL query
    results = graphql_clients[api_name].execute_query(gql_query)
    #  Store the query and result in RDF
    rdf_store.add_query_result(user_query, gql_query, str(results))
    rdf_store.save_to_file()  # Save RDF after each query
    return {"query": gql_query, "response": results}


# Start FastAPI Server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)

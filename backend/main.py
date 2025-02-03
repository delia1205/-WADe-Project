import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse 
from pydantic import BaseModel
from app.graphql_client import GraphQLClient
from app.nlp_engine import NLPProcessor
from app.rdf_store import RDFStore  # Import RDF storage module
import json
import csv
from io import StringIO

def convert_to_csv(data):
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    
    writer.writeheader()
    
    writer.writerows(data)
    
    output.seek(0)
    
    return output.getvalue()

def convert_to_json(data):
    return json.dumps(data, indent=4)


# Initialize FastAPI
app = FastAPI()
rdf_store = RDFStore()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (use specific domains in production)
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

nlp = NLPProcessor()

class QueryRequest(BaseModel):
    user_input: str 

graphql_clients = {
    "countries": GraphQLClient("https://countries.trevorblades.com/"),
}

@app.post("/query")
def process_query(request: QueryRequest):
    """Receives a natural language query and executes the corresponding GraphQL query."""
    user_query = request.user_input
    parsed_query = nlp.process_query(user_query)
    api_name = parsed_query["api"]
    query_type = parsed_query["type"]
    entities = parsed_query["entities"]

    if api_name != "countries":
        return {"error": "Unsupported API"}

    gql_query = ""

    if query_type == "single":
        country_code = entities[0]
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
    elif query_type == "multiple":
        country_queries = "\n".join(
            [f'{code}: country(code: "{code}") {{ name capital currency languages {{ name }} }}' for code in entities]
        )
        gql_query = f"{{ {country_queries} }}"
    elif query_type == "region":
        gql_query = f"""
        {{
          countries {{
            code
            name
            continent {{
              name
            }}
          }}
        }}
        """
    elif query_type == "currency":
        gql_query = f"""
        {{
          countries {{
            name
            currency
          }}
        }}
        """
    else:
        return {"error": "Could not determine query type"}

    results = graphql_clients[api_name].execute_query(gql_query)

    if query_type == "region":
        region_name = entities[0].capitalize() 
        results = {
            "countries": [
                country for country in results["data"]["countries"] if country["continent"]["name"] == region_name
            ]
        }
    elif query_type == "currency":
        currency_name = entities[0].strip().lower()
        results = {} 

        if "data" in results: 
            countries = results["data"].get("countries", [])
            filtered_results = []
            for country in countries:
                if country.get("currency"):
                    country_currencies = [currency.strip().lower() for currency in country["currency"].split(",")]
                    if currency_name in country_currencies:
                        filtered_results.append(country)
        else:
            print("Error: No 'data' key found in the response")  
            results = {"countries": []} 


    # Store query and result in RDF
    query_uri = rdf_store.add_query_result(user_query, gql_query, str(results))
    rdf_store.save_to_file()

    return {"query": gql_query, "response": results, "link": query_uri}


@app.post("/export")
async def export_results(request: Request):  
    body = await request.json()
    data = body.get("data")
    export_format = body.get("format")

    if not data or not export_format:
        raise HTTPException(status_code=400, detail="Missing data or format")

    if export_format == 'csv':
        file_data = convert_to_csv(data)
        mimetype = 'text/csv'
        extension = '.csv'
    elif export_format == 'json':
        file_data = convert_to_json(data)
        mimetype = 'application/json'
        extension = '.json'
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")

    return StreamingResponse(
        file_data,
        media_type=mimetype, 
        headers={"Content-Disposition": f"attachment; filename=exported_results{extension}"}
    )


# Start FastAPI Server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)

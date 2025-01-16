
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Initialize NLP pipeline (example with Hugging Face)
nlp_pipeline = pipeline("text2text-generation", model="t5-small")

class QueryRequest(BaseModel):
    input: str

@app.post("/query")
def process_query(request: QueryRequest):
    try:
        processed_query = nlp_pipeline(request.input)
        # Mock GraphQL response for testing
        return {"query": request.input, "response": processed_query[0]['generated_text']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

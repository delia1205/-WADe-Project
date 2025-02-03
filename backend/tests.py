import unittest
import json
from fastapi.testclient import TestClient
from main import app

class APITestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Initialize Test Client for FastAPI"""
        cls.client = TestClient(app)

    def test_graphql_query(self):
        """Test submitting a GraphQL query from natural language input."""
        response = self.client.post('/query', json={'user_input': 'What is the capital of France?'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('query', data)
        self.assertIn('response', data)

    def test_rdf_retrieval(self):
        """Test retrieving RDF data in Turtle format."""
        response = self.client.get('/rdf?format=turtle')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.text.startswith("@prefix"))

    def test_sparql_query(self):
        """Test executing a sample SPARQL query."""
        sparql_query = {
            "query": "PREFIX ex: <http://example.org/queries#> SELECT ?userQuery WHERE { ?query ex:userQuery ?userQuery . }"
        }
        response = self.client.post('/sparql', json=sparql_query)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data), 0)

if __name__ == '__main__':
    unittest.main()

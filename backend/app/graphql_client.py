import requests

class GraphQLClient:
    def __init__(self, endpoint):
        self.endpoint = endpoint
        self.schema = self.get_schema()

    def get_schema(self):
        """Fetch GraphQL API schema."""
        query = """
        {
          __schema {
            types {
              name
              kind
              fields {
                name
              }
            }
          }
        }
        """
        response = requests.post(self.endpoint, json={'query': query})
        return response.json()

    def execute_query(self, query):
        """Execute a GraphQL query."""
        response = requests.post(self.endpoint, json={'query': query})
        return response.json()

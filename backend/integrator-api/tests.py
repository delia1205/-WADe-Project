import pytest
from main import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_graphql_query_success(client, mocker):
    mock_response = {"data": {"launchesPast": [{"mission_name": "Apollo 11"}]}}
    mocker.patch("main.make_graphql_request", return_value=mock_response)

    response = client.post("/graphql-query", json={
        "query": "{ launchesPast(limit: 1) { mission_name } }",
        "api_name": "spacex"
    })

    assert response.status_code == 200
    assert response.json == mock_response


def test_graphql_query_missing_params(client):
    response = client.post("/graphql-query", json={})
    assert response.status_code == 400
    assert response.json == {"error": "Missing query or api_name"}


def test_graphql_query_unsupported_api(client):
    response = client.post("/graphql-query", json={
        "query": "{ launchesPast(limit: 1) { mission_name } }",
        "api_name": "unknown_api"
    })

    assert response.status_code == 400
    assert response.json == {"error": "Unsupported API"}


def test_sparql_query_success(client, mocker):
    mock_response = {"head": {"vars": ["subject", "predicate", "object"]}, "results": {"bindings": []}}
    mocker.patch("main.make_sparql_request", return_value=mock_response)

    response = client.post("/sparql-query", json={
        "query": "SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object } LIMIT 1",
        "api_name": "dbpedia"
    })

    assert response.status_code == 200
    assert response.json == mock_response


def test_sparql_query_missing_params(client):
    response = client.post("/sparql-query", json={})
    assert response.status_code == 400
    assert response.json == {"error": "Missing query or api_name"}


def test_sparql_query_unsupported_api(client):
    response = client.post("/sparql-query", json={
        "query": "SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object } LIMIT 1",
        "api_name": "unknown_api"
    })

    assert response.status_code == 400
    assert response.json == {"error": "Unsupported API"}

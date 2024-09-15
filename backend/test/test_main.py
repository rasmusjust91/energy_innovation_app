from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_create_idea():
    response = client.post("/ideas", json={
        "title": "New Wind Turbine",
        "description": "An innovative design for wind turbines",
        "category": "wind",
        "submitter": "John Smith"
    })
    assert response.status_code == 200
    assert response.json()["title"] == "New Wind Turbine"

def test_get_ideas():
    response = client.get("/ideas")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0  # At least one idea should be present
    assert data[-1]["title"] == "New Wind Turbine"

def test_get_ideas_with_filter():
    response = client.get("/ideas", params={"category": "wind"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0  # At least one solar idea should be present
    assert data[0]["category"] == "wind"

def test_update_idea_status():
    # First, create an idea to update
    create_response = client.post(
        "/ideas",
        json={
            "title": "Wind Turbine Innovation",
            "description": "A more aerodynamic blade design.",
            "category": "wind",
            "submitter": "John Smith"
        }
    )
    assert create_response.status_code == 200
    idea_id = create_response.json()["id"]

    # Now, update the status of the created idea
    response = client.put(f"/ideas/{idea_id}", json={"status": "in development"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "in development"

def test_add_comment():
    # First, create an idea to comment on
    create_response = client.post(
        "/ideas",
        json={
            "title": "Battery Storage Enhancement",
            "description": "A new method to store energy more efficiently.",
            "category": "energy storage",
            "submitter": "Alice Doe"
        }
    )
    assert create_response.status_code == 200
    idea_id = create_response.json()["id"]

    # Now, add a comment to that idea
    response = client.post(
        f"/ideas/{idea_id}/comments",
        json={
            "content": "This is a promising idea!",
            "author": "Jane Reviewer"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "This is a promising idea!"
    assert data["author"] == "Jane Reviewer"
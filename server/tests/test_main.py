import pytest
from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

@pytest.fixture
def test_db():
    """Setup test database"""
    # Les variables d'environnement sont définies dans le workflow CI
    yield

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_register_user():
    """Test user registration"""
    user_data = {
        "last_name": "Test",
        "first_name": "User",
        "email": "test@example.com",
        "password": "testpassword123",
        "birth_date": "1990-01-01",
        "city": "Paris",
        "postal_code": "75001"
    }
    
    response = client.post("/api/register", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == user_data["email"]

def test_login_user():
    """Test user login"""
    # First register a user
    user_data = {
        "last_name": "Login",
        "first_name": "Test",
        "email": "login@example.com",
        "password": "testpassword123",
        "birth_date": "1990-01-01",
        "city": "Paris",
        "postal_code": "75001"
    }
    
    client.post("/api/register", json=user_data)
    
    # Then login
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    
    response = client.post("/api/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == user_data["email"]

def test_public_users_endpoint():
    """Test public users endpoint"""
    response = client.get("/api/public-users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_users_endpoint_unauthorized():
    """Test users endpoint without authentication"""
    response = client.get("/api/users")
    assert response.status_code == 401

def test_cors_headers():
    """Test CORS headers are present"""
    response = client.options("/api/register")
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers 
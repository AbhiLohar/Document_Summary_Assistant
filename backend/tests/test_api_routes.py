"""Integration tests for FastAPI endpoints."""

import os
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from tests.generate_test_samples import create_sample_text_pdf

client = TestClient(app)


def test_health_endpoint():
    """Test /api/health endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "pdf" in data["allowed_extensions"]
    assert "png" in data["allowed_extensions"]


def test_upload_invalid_file_type():
    """Test that uploading invalid file type returns 400."""
    files = {"file": ("malicious.exe", b"binarycontent", "application/octet-stream")}
    response = client.post("/api/upload", files=files)
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]


def test_upload_empty_file():
    """Test that uploading 0-byte file returns 400."""
    files = {"file": ("empty.pdf", b"", "application/pdf")}
    response = client.post("/api/upload", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"]


def test_upload_valid_pdf():
    """Test uploading a valid text PDF and extracting text."""
    sample_pdf = create_sample_text_pdf("integration_test.pdf")
    with open(sample_pdf, "rb") as f:
        files = {"file": ("integration_test.pdf", f, "application/pdf")}
        response = client.post("/api/upload", files=files)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "Advancements in Edge Computing" in data["extracted_text"]
    assert data["metadata"]["file_type"] == "pdf"
    assert data["metadata"]["word_count"] > 10


def test_summarize_endpoint_with_mock():
    """Test /api/summarize endpoint with mocked AI analysis."""
    mock_response = {
        "summary": "This is a comprehensive summary of edge computing in autonomous systems.",
        "key_points": ["Sub-millisecond inference.", "Reduced cloud dependency."],
        "main_ideas": [{"title": "Overview", "summary": "Discusses edge computing architectures."}],
        "improvement_suggestions": [{"category": "Structure", "suggestion": "Clear document.", "severity": "low"}],
    }

    with patch("app.services.ai_service.AIService._single_pass_analysis", return_value=mock_response), \
         patch("app.services.ai_service.AIService.is_configured", return_value=True):
        payload = {
            "text": "This is test document content for summarization testing.",
            "summary_length": "medium",
            "api_key": "dummy_key",
        }
        response = client.post("/api/summarize", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["summary"] == mock_response["summary"]
        assert len(data["key_points"]) == 2
        assert data["summary_length"] == "medium"

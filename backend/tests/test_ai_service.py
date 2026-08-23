"""Unit tests for AIService and JSON response validation."""

from unittest.mock import MagicMock, patch
from app.services.ai_service import ai_service
from app.models.schemas import SummaryLength, DocumentMetadata


def test_ai_service_json_parsing():
    """Test cleaning and parsing JSON responses from LLM."""
    mock_json_str = """
    ```json
    {
      "summary": "This is a concise executive summary.",
      "key_points": [
        "First key point with data",
        "Second key point regarding latency"
      ],
      "main_ideas": [
        {"title": "Introduction", "summary": "Covers edge computing background."}
      ],
      "improvement_suggestions": [
        {"category": "Clarity", "suggestion": "Add explicit metrics for latency.", "severity": "medium"}
      ]
    }
    ```
    """
    parsed = ai_service._clean_and_parse_json(mock_json_str)
    assert parsed["summary"] == "This is a concise executive summary."
    assert len(parsed["key_points"]) == 2
    assert len(parsed["main_ideas"]) == 1
    assert len(parsed["improvement_suggestions"]) == 1


def test_ai_service_with_mocked_gemini():
    """Test full analyze_document flow with mocked generate_with_fallback."""
    mock_json_response = """
    {
      "summary": "Edge architectures optimize autonomous system latency and throughput.",
      "key_points": [
        "42% decrease in latency.",
        "35% bandwidth reduction."
      ],
      "main_ideas": [
        {"title": "Methodology", "summary": "Two-tier hierarchical arbitration."}
      ],
      "improvement_suggestions": [
        {"category": "Readability", "suggestion": "The document is clear and well-structured.", "severity": "low"}
      ]
    }
    """

    with patch.object(ai_service, "_generate_with_fallback", return_value=mock_json_response):
        meta = DocumentMetadata(
            filename="test.pdf",
            file_type="pdf",
            file_size_bytes=1024,
            page_count=2,
            character_count=500,
            word_count=80,
            is_scanned=False,
            extraction_method="pymupdf",
        )

        res = ai_service.analyze_document(
            text="Advancements in Edge Computing and Autonomous Systems...",
            summary_length=SummaryLength.SHORT,
            metadata=meta,
            api_key="test_dummy_key_123",
        )

        assert res.summary == "Edge architectures optimize autonomous system latency and throughput."
        assert len(res.key_points) == 2
        assert res.summary_length == SummaryLength.SHORT
        assert res.metadata.filename == "test.pdf"

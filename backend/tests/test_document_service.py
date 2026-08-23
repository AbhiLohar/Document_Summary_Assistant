"""Unit tests for DocumentService (PyMuPDF extraction and scanned document detection)."""

import os
import pytest
from app.services.document_service import document_service
from tests.generate_test_samples import (
    create_sample_text_pdf,
    create_sample_scanned_pdf,
)


@pytest.fixture(scope="module")
def sample_pdf_path():
    return create_sample_text_pdf("test_sample_research.pdf")


@pytest.fixture(scope="module")
def scanned_pdf_path():
    return create_sample_scanned_pdf("test_scanned_sample.pdf")


def test_extract_from_text_pdf(sample_pdf_path):
    """Test extracting text from standard text-based PDF."""
    text, metadata = document_service.extract_from_file(sample_pdf_path, "test_sample_research.pdf")
    
    assert text is not None
    assert len(text) > 100
    assert "Advancements in Edge Computing" in text
    assert "Executive Abstract" in text
    assert metadata.file_type == "pdf"
    assert metadata.page_count >= 1
    assert metadata.character_count > 100
    assert metadata.word_count > 20
    assert metadata.is_scanned is False


def test_scanned_pdf_detection(scanned_pdf_path):
    """Test that a PDF composed of images is correctly identified as scanned."""
    text, metadata = document_service.extract_from_file(scanned_pdf_path, "test_scanned_sample.pdf")
    
    assert metadata.file_type == "pdf"
    assert metadata.is_scanned is True


def test_unsupported_file_extension():
    """Test that unsupported file extensions raise ValueError."""
    with pytest.raises(ValueError) as excinfo:
        document_service.extract_from_file("test.exe", "test.exe")
    assert "Unsupported file extension" in str(excinfo.value)

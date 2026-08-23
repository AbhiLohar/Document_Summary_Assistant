"""Unit tests for OCRService."""

import pytest
from PIL import Image
from app.services.ocr_service import ocr_service
from tests.generate_test_samples import create_sample_ocr_image


@pytest.fixture(scope="module")
def sample_image_path():
    return create_sample_ocr_image("test_sample_image.png")


def test_image_preprocessing(sample_image_path):
    """Test image enhancement preprocessing."""
    img = Image.open(sample_image_path)
    processed = ocr_service.preprocess_image(img)
    assert processed is not None
    assert processed.mode == "L"  # Grayscale
    img.close()


def test_ocr_extraction_or_graceful_handling(sample_image_path):
    """Test that OCR extracts text if tesseract is present, or raises informative error if not."""
    if ocr_service.is_available:
        text = ocr_service.extract_text_from_image_path(sample_image_path)
        assert text is not None
        assert "STRATEGY" in text or "PRODUCT" in text or len(text) > 20
    else:
        # If tesseract is not installed on system, verify clear RuntimeError
        with pytest.raises(RuntimeError) as excinfo:
            ocr_service.extract_text_from_image_path(sample_image_path)
        assert "Tesseract OCR is not installed" in str(excinfo.value)

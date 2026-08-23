"""Document extraction service supporting PDF parsing via PyMuPDF (fitz) and OCR."""

import os
import io
import base64
import logging
from typing import Tuple
import fitz  # PyMuPDF
from PIL import Image
from ..models.schemas import DocumentMetadata
from ..config import settings
from ..utils.file_utils import (
    clean_extracted_text,
    calculate_text_metrics,
    get_file_extension,
)
from .ocr_service import ocr_service
from .ai_service import ai_service

logger = logging.getLogger(__name__)

# Character threshold below which a page is considered image/scanned
SCANNED_PAGE_CHAR_THRESHOLD = 40


class DocumentService:
    """Service to handle document reading, parsing, and text extraction."""

    def extract_from_file(self, file_path: str, original_filename: str, api_key: str = None) -> Tuple[str, DocumentMetadata]:
        """Extract text and metadata from a given file path based on its extension."""
        ext = get_file_extension(original_filename)

        if ext not in settings.ALLOWED_EXTENSIONS:
            raise ValueError(f"Unsupported file extension: .{ext}")

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found at path: {file_path}")

        file_size = os.path.getsize(file_path)

        if ext == "pdf":
            return self._extract_from_pdf(file_path, original_filename, file_size, api_key=api_key)
        else:
            return self._extract_from_image(file_path, original_filename, file_size, api_key=api_key)

    def _extract_from_pdf(self, pdf_path: str, filename: str, file_size: int, api_key: str = None) -> Tuple[str, DocumentMetadata]:
        """Extract text from a PDF file using PyMuPDF, with OCR fallback for scanned pages."""
        doc = fitz.open(pdf_path)
        page_count = len(doc)
        
        extracted_pages = []
        is_scanned = False
        low_text_page_count = 0
        total_native_chars = 0

        # Step 1: Attempt standard native text extraction with PyMuPDF
        for page_num in range(page_count):
            page = doc.load_page(page_num)
            # Use 'text' or 'blocks' layout
            page_text = page.get_text("text")
            cleaned_page_text = clean_extracted_text(page_text)
            
            char_len = len(cleaned_page_text)
            total_native_chars += char_len
            
            if char_len < SCANNED_PAGE_CHAR_THRESHOLD:
                low_text_page_count += 1
                
            extracted_pages.append(cleaned_page_text)

        # Step 2: Determine if PDF is predominantly scanned/image-based
        if page_count > 0 and (low_text_page_count / page_count >= 0.7 or total_native_chars < 50):
            logger.info(f"PDF '{filename}' appears to be scanned or contains little native text. Triggering OCR fallback.")
            is_scanned = True
            
            # If OCR is available, render pages to images and run OCR
            if ocr_service.is_available:
                ocr_pages = []
                for page_num in range(page_count):
                    page = doc.load_page(page_num)
                    # Render page to high-res pixmap (DPI ~ 200 via 2.0 zoom factor)
                    zoom = 2.0
                    mat = fitz.Matrix(zoom, zoom)
                    pix = page.get_pixmap(matrix=mat)
                    img_data = pix.tobytes("png")
                    img = Image.open(io.BytesIO(img_data))
                    
                    page_ocr_text = ocr_service.extract_text_from_pil_image(img)
                    if page_ocr_text:
                        ocr_pages.append(f"--- Page {page_num + 1} ---\n{page_ocr_text}")
                    elif extracted_pages[page_num]:
                        ocr_pages.append(f"--- Page {page_num + 1} ---\n{extracted_pages[page_num]}")
                
                final_text = "\n\n".join(ocr_pages)
                extraction_method = "pymupdf_with_tesseract_ocr"
            else:
                # Tesseract not available — try Gemini Vision on each page
                logger.info("Tesseract OCR unavailable. Attempting Gemini Vision OCR for scanned PDF pages...")
                vision_pages = []
                for page_num in range(page_count):
                    page = doc.load_page(page_num)
                    zoom = 2.0
                    mat = fitz.Matrix(zoom, zoom)
                    pix = page.get_pixmap(matrix=mat)
                    img_data = pix.tobytes("png")
                    img = Image.open(io.BytesIO(img_data))

                    try:
                        vision_text = ai_service.extract_text_from_image(img, api_key=api_key)
                    except Exception as e:
                        logger.warning(f"Gemini vision error for page {page_num + 1}: {e}")
                        vision_text = ""

                    if vision_text:
                        vision_pages.append(f"--- Page {page_num + 1} ---\n{vision_text}")
                    elif extracted_pages[page_num]:
                        vision_pages.append(f"--- Page {page_num + 1} ---\n{extracted_pages[page_num]}")

                if vision_pages:
                    final_text = "\n\n".join(vision_pages)
                    extraction_method = "pymupdf_with_gemini_vision"
                else:
                    # Fall back to whatever raw text exists
                    page_texts = [f"--- Page {i + 1} ---\n{p}" for i, p in enumerate(extracted_pages) if p]
                    final_text = "\n\n".join(page_texts) if page_texts else ""
                    extraction_method = "pymupdf_scanned_no_ocr"
        else:
            # Multi-page formatting
            page_texts = []
            for i, p in enumerate(extracted_pages):
                if p:
                    page_texts.append(f"--- Page {i + 1} ---\n{p}")
            final_text = "\n\n".join(page_texts)
            extraction_method = "pymupdf"

        doc.close()

        final_text = clean_extracted_text(final_text)
        char_count, word_count = calculate_text_metrics(final_text)

        metadata = DocumentMetadata(
            filename=filename,
            file_type="pdf",
            file_size_bytes=file_size,
            page_count=page_count,
            character_count=char_count,
            word_count=word_count,
            is_scanned=is_scanned,
            extraction_method=extraction_method,
        )

        return final_text, metadata

    def _extract_from_image(self, image_path: str, filename: str, file_size: int, api_key: str = None) -> Tuple[str, DocumentMetadata]:
        """Extract text from an image file using OCR, with Gemini Vision fallback."""
        ext = get_file_extension(filename)
        
        try:
            with Image.open(image_path) as img:
                # Basic sanity check on image format
                img.verify()
        except Exception as e:
            raise ValueError(f"Corrupted or invalid image file: {str(e)}")

        # Reopen image for processing
        with Image.open(image_path) as img:
            extracted_text = ""
            extraction_method = "ocr_unavailable"

            # 1. Try Tesseract OCR if available
            if ocr_service.is_available:
                try:
                    extracted_text = ocr_service.extract_text_from_pil_image(img)
                    if extracted_text:
                        extraction_method = "tesseract_ocr"
                except Exception as e:
                    logger.warning(f"Tesseract OCR failed: {e}")

            # 2. Fallback to Google Gemini Vision if Tesseract was unavailable or returned empty
            if not extracted_text:
                logger.info("Attempting Gemini Vision OCR for image...")
                try:
                    extracted_text = ai_service.extract_text_from_image(img, api_key=api_key)
                    if extracted_text:
                        extraction_method = "gemini_vision_ocr"
                except Exception as e:
                    logger.error(f"Gemini Vision OCR error: {e}")
                    raise

        extracted_text = clean_extracted_text(extracted_text)
        char_count, word_count = calculate_text_metrics(extracted_text)

        metadata = DocumentMetadata(
            filename=filename,
            file_type=ext,
            file_size_bytes=file_size,
            page_count=1,
            character_count=char_count,
            word_count=word_count,
            is_scanned=True,
            extraction_method=extraction_method,
        )

        return extracted_text, metadata


# Singleton instance
document_service = DocumentService()


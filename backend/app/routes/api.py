"""API Route endpoints for health, document upload, extraction, and summarization."""

import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from ..config import settings
from ..models.schemas import (
    SummaryLength,
    DocumentAnalysisResponse,
    SummarizeRequest,
    ExtractResponse,
    HealthResponse,
    DocumentMetadata,
)
from ..services.document_service import document_service
from ..services.ocr_service import ocr_service
from ..services.ai_service import ai_service
from ..utils.file_utils import (
    validate_file_upload,
    save_temp_file,
    remove_temp_file,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["document-summary"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint providing status and subsystem availability."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        gemini_configured=ai_service.is_configured(),
        tesseract_available=ocr_service.is_available,
        allowed_extensions=settings.ALLOWED_EXTENSIONS,
    )


@router.get("/validate-key")
async def validate_api_key(api_key: Optional[str] = None):
    """Validate a Gemini API key and return enabled models."""
    key = api_key or settings.GEMINI_API_KEY
    if not key or not key.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No API key provided to validate.",
        )
    try:
        models = ai_service.get_available_models_for_key(key.strip())
        return {
            "valid": True,
            "models_count": len(models),
            "available_models": models[:5],
            "message": "API key is valid and connected to Google Gemini.",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"API Key validation failed: {str(e)}",
        )


@router.post("/upload", response_model=ExtractResponse)
async def upload_and_extract(
    file: UploadFile = File(..., description="Document (PDF, PNG, JPG, WEBP, BMP, TIFF) to extract text from"),
    api_key: Optional[str] = Form(None, description="Optional Gemini API key for Vision OCR fallback"),
):
    """Upload a document file, validate it, and extract raw text via PyMuPDF or OCR."""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload request.",
        )

    # Read uploaded bytes into memory
    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty (0 bytes).",
        )

    # Validate file extension and size
    validate_file_upload(file.filename, file_size)

    # Save to temp location for processing
    temp_path = save_temp_file(file_bytes, file.filename)

    try:
        effective_key = api_key or settings.GEMINI_API_KEY or None
        extracted_text, metadata = document_service.extract_from_file(temp_path, file.filename, api_key=effective_key)

        if not extracted_text or not extracted_text.strip():
            # If PDF/image extraction returned nothing
            if metadata.is_scanned and metadata.extraction_method == "ocr_unavailable":
                warning_msg = (
                    "Document appears to be a scanned image or photo, but neither Tesseract OCR nor Gemini Vision OCR "
                    "could extract text. Please configure a Gemini API key in the settings, or install Tesseract OCR, "
                    "or provide a text-based PDF."
                )
            elif metadata.is_scanned:
                warning_msg = "OCR was attempted but no readable text could be extracted from this image/scanned document."
            else:
                warning_msg = "No readable text could be found in the uploaded document."
                
            return ExtractResponse(
                metadata=metadata,
                extracted_text="",
                success=False,
                message=warning_msg,
            )

        return ExtractResponse(
            metadata=metadata,
            extracted_text=extracted_text,
            success=True,
            message="Text successfully extracted.",
        )

    except HTTPException:
        raise
    except (ValueError, RuntimeError) as ve:
        logger.warning(f"Validation/runtime error during document extraction: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as e:
        logger.error(f"Error during document extraction: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process document: {str(e)}",
        )
    finally:
        remove_temp_file(temp_path)


@router.post("/summarize", response_model=DocumentAnalysisResponse)
async def summarize_text(request: SummarizeRequest):
    """Generate structured AI summary, key points, main ideas, and improvement suggestions from text."""
    if not request.text or not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text cannot be empty.",
        )

    try:
        analysis_result = ai_service.analyze_document(
            text=request.text,
            summary_length=request.summary_length,
            metadata=request.metadata,
            api_key=request.api_key,
        )
        return analysis_result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except RuntimeError as re:
        logger.error(f"Runtime error in AI summarization: {re}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(re),
        )
    except Exception as e:
        logger.error(f"Unexpected error in /summarize: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Summarization failed: {str(e)}",
        )


@router.post("/process", response_model=DocumentAnalysisResponse)
async def process_document_end_to_end(
    file: UploadFile = File(..., description="Document file to process"),
    summary_length: SummaryLength = Form(SummaryLength.MEDIUM),
    api_key: Optional[str] = Form(None),
):
    """All-in-one endpoint: Upload -> Extract Text -> AI Summarize & Analyze."""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload request.",
        )

    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty (0 bytes).",
        )

    validate_file_upload(file.filename, file_size)
    temp_path = save_temp_file(file_bytes, file.filename)

    try:
        effective_key = api_key or settings.GEMINI_API_KEY or None
        extracted_text, metadata = document_service.extract_from_file(temp_path, file.filename, api_key=effective_key)

        if not extracted_text or not extracted_text.strip():
            if metadata.is_scanned:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Document appears to be scanned but no text could be extracted via OCR. Please configure a Gemini API key, install Tesseract OCR, or upload a text-based document.",
                )
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Unable to extract text from the document. The document may be blank or protected.",
            )

        analysis_result = ai_service.analyze_document(
            text=extracted_text,
            summary_length=summary_length,
            metadata=metadata,
            api_key=api_key,
        )
        return analysis_result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in end-to-end process: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing failed: {str(e)}",
        )
    finally:
        remove_temp_file(temp_path)

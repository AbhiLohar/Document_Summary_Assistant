"""Pydantic data models for request and response validation."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class SummaryLength(str, Enum):
    """User selectable summary length."""
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"


class DocumentMetadata(BaseModel):
    """Metadata regarding the uploaded and processed document."""
    filename: str
    file_type: str
    file_size_bytes: int
    page_count: int = 1
    character_count: int = 0
    word_count: int = 0
    is_scanned: bool = False
    extraction_method: str = "pymupdf"


class MainIdea(BaseModel):
    """Identified section / topic with high-level takeaway."""
    title: str = Field(..., description="The dynamic section or topic title")
    summary: str = Field(..., description="Key concept or content covered in this section")


class ImprovementSuggestion(BaseModel):
    """Actionable improvement recommendation for document content or structure."""
    category: str = Field(..., description="Area of improvement, e.g. Clarity, Structure, Evidence, Readability, Context")
    suggestion: str = Field(..., description="Specific recommendation or observation")
    severity: str = Field(default="medium", description="Importance level: low, medium, high, or praise")


class DocumentAnalysisResponse(BaseModel):
    """Complete analysis result returned to the client."""
    metadata: DocumentMetadata
    summary: str
    summary_length: SummaryLength
    key_points: List[str]
    main_ideas: List[MainIdea]
    improvement_suggestions: List[ImprovementSuggestion]
    extracted_text: str
    is_hierarchical: bool = False
    warning: Optional[str] = None


class SummarizeRequest(BaseModel):
    """Request payload to summarize already extracted or supplied text."""
    text: str = Field(..., min_length=5, description="Text to be summarized and analyzed")
    summary_length: SummaryLength = SummaryLength.MEDIUM
    api_key: Optional[str] = Field(default=None, description="Optional user-supplied Gemini API key")
    metadata: Optional[DocumentMetadata] = None


class ExtractResponse(BaseModel):
    """Response containing extracted text and document metadata."""
    metadata: DocumentMetadata
    extracted_text: str
    success: bool = True
    message: Optional[str] = None


class HealthResponse(BaseModel):
    """System health check and capabilities status."""
    status: str = "healthy"
    version: str = "1.0.0"
    gemini_configured: bool = False
    tesseract_available: bool = False
    allowed_extensions: List[str]


class ErrorResponse(BaseModel):
    """Structured error message for user-friendly UI display."""
    detail: str
    error_code: Optional[str] = None

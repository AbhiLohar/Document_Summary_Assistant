"""File handling, validation, text cleaning, and sanitization utilities."""

import os
import re
import uuid
import unicodedata
from typing import Tuple
from fastapi import HTTPException, status
from ..config import settings


def sanitize_filename(filename: str) -> str:
    """Sanitize uploaded filename to prevent directory traversal and special character issues."""
    if not filename:
        return f"document_{uuid.uuid4().hex[:8]}.pdf"
    
    # Extract base name
    base_name = os.path.basename(filename)
    # Normalize unicode
    base_name = unicodedata.normalize("NFKD", base_name)
    # Replace unsafe characters
    safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", base_name)
    # Remove leading dots or slashes
    safe_name = safe_name.lstrip(".")
    
    if not safe_name:
        safe_name = f"doc_{uuid.uuid4().hex[:8]}"
        
    return safe_name


def get_file_extension(filename: str) -> str:
    """Extract lowercase file extension without dot."""
    if "." in filename:
        return filename.rsplit(".", 1)[-1].lower()
    return ""


def validate_file_upload(filename: str, file_size: int) -> str:
    """Validate file extension and size against configured boundaries."""
    ext = get_file_extension(filename)
    if not ext or ext not in settings.ALLOWED_EXTENSIONS:
        allowed = ", ".join(settings.ALLOWED_EXTENSIONS)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '.{ext}'. Supported formats: {allowed}",
        )

    if file_size > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB.",
        )

    return ext


def clean_extracted_text(text: str) -> str:
    """Clean extracted document text: remove excess whitespace, normalize linebreaks, fix encoding artifacts."""
    if not text:
        return ""

    # Normalize unicode
    text = unicodedata.normalize("NFKC", text)
    
    # Replace non-breaking spaces and zero-width spaces
    text = text.replace("\u00a0", " ").replace("\u200b", "").replace("\ufeff", "")
    
    # Replace null bytes
    text = text.replace("\x00", "")

    # Normalize carriage returns
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Fix broken hyphenated line wraps (e.g. "com-\nputer" -> "computer")
    text = re.sub(r"(\w+)-\n(\w+)", r"\1\2", text)

    # Collapse more than 2 consecutive newlines into 2
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Collapse multiple inline spaces/tabs to a single space
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]
    text = "\n".join(lines)

    return text.strip()


def calculate_text_metrics(text: str) -> Tuple[int, int]:
    """Calculate character count and word count."""
    if not text:
        return 0, 0
    char_count = len(text)
    # Split on whitespace for word count
    words = text.split()
    word_count = len(words)
    return char_count, word_count


def save_temp_file(file_bytes: bytes, filename: str) -> str:
    """Save upload bytes to a unique temporary file and return the path."""
    unique_id = uuid.uuid4().hex
    safe_name = sanitize_filename(filename)
    temp_filename = f"{unique_id}_{safe_name}"
    file_path = os.path.join(settings.TEMP_DIR, temp_filename)
    
    with open(file_path, "wb") as f:
        f.write(file_bytes)
        
    return file_path


def remove_temp_file(file_path: str) -> None:
    """Safely delete temporary file if it exists."""
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
        except OSError:
            pass

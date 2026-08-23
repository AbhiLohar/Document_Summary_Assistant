"""Application configuration and settings."""

import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

    # Document upload limits
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "25"))
    MAX_FILE_SIZE_BYTES: int = MAX_FILE_SIZE_MB * 1024 * 1024

    # Supported file extensions
    ALLOWED_EXTENSIONS: List[str] = [
        "pdf",
        "png",
        "jpg",
        "jpeg",
        "webp",
        "bmp",
        "tiff",
        "tif",
    ]

    # OCR Settings
    TESSERACT_CMD: str = os.getenv("TESSERACT_CMD", "")

    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,*"
        ).split(",")
        if origin.strip()
    ]

    # Temp file directory
    TEMP_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "temp_uploads")

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore",
    )


settings = Settings()

# Ensure temp directory exists
os.makedirs(settings.TEMP_DIR, exist_ok=True)

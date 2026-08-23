"""Application configuration and settings."""

import os
import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # API Keys
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"

    # Document upload limits
    MAX_FILE_SIZE_MB: int = 25
    MAX_FILE_SIZE_BYTES: int = 25 * 1024 * 1024

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
    TESSERACT_CMD: str = ""

    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: Union[List[str], str] = ["*"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from comma-separated string, JSON list string, or list."""
        if isinstance(v, str):
            v_trimmed = v.strip()
            if v_trimmed.startswith("[") and v_trimmed.endswith("]"):
                try:
                    return json.loads(v_trimmed)
                except Exception:
                    pass
            return [origin.strip() for origin in v_trimmed.split(",") if origin.strip()]
        return v

    @field_validator("MAX_FILE_SIZE_BYTES", mode="before")
    @classmethod
    def calculate_bytes(cls, v, values):
        return v

    # Temp file directory
    TEMP_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "temp_uploads")

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
# Recalculate bytes dynamically from MAX_FILE_SIZE_MB
settings.MAX_FILE_SIZE_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024

# Ensure temp directory exists
os.makedirs(settings.TEMP_DIR, exist_ok=True)

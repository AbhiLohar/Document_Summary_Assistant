"""OCR (Optical Character Recognition) service using Tesseract with image preprocessing."""

import os
import shutil
import logging
from typing import Optional, List
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
from ..config import settings
from ..utils.file_utils import clean_extracted_text

logger = logging.getLogger(__name__)


class OCRService:
    """Service for extracting text from images and scanned PDF pages."""

    def __init__(self):
        self._tesseract_available = False
        self._setup_tesseract_path()

    def _setup_tesseract_path(self):
        """Locate and configure Tesseract executable path."""
        # 1. Custom configured path
        if settings.TESSERACT_CMD and os.path.isfile(settings.TESSERACT_CMD):
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD
            self._tesseract_available = True
            return

        # 2. System PATH
        which_path = shutil.which("tesseract")
        if which_path:
            pytesseract.pytesseract.tesseract_cmd = which_path
            self._tesseract_available = True
            return

        # 3. Standard Windows locations
        windows_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
            os.path.expandvars(r"%USERPROFILE%\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
            os.path.expandvars(r"%ChocolateyInstall%\bin\tesseract.exe"),
        ]

        for path in windows_paths:
            if os.path.isfile(path):
                pytesseract.pytesseract.tesseract_cmd = path
                self._tesseract_available = True
                logger.info(f"Tesseract OCR found at: {path}")
                return

        # 4. Standard Linux / MacOS locations
        posix_paths = ["/usr/bin/tesseract", "/usr/local/bin/tesseract", "/opt/homebrew/bin/tesseract"]
        for path in posix_paths:
            if os.path.isfile(path):
                pytesseract.pytesseract.tesseract_cmd = path
                self._tesseract_available = True
                logger.info(f"Tesseract OCR found at: {path}")
                return

        logger.warning("Tesseract executable not detected in default paths.")
        self._tesseract_available = False

    @property
    def is_available(self) -> bool:
        """Check if Tesseract is available on the system."""
        if not self._tesseract_available:
            self._setup_tesseract_path()
        return self._tesseract_available

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """Apply filters and enhancements to improve OCR accuracy on scanned documents."""
        try:
            # Convert to grayscale
            if image.mode != "L":
                gray = image.convert("L")
            else:
                gray = image

            # Increase contrast
            enhancer = ImageEnhance.Contrast(gray)
            enhanced = enhancer.enhance(1.8)

            # Slight sharpen filter
            sharpened = enhanced.filter(ImageFilter.SHARPEN)

            return sharpened
        except Exception as e:
            logger.warning(f"Image preprocessing failed, using original: {e}")
            return image

    def extract_text_from_image_path(self, image_path: str) -> str:
        """Extract text from an image file on disk."""
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at {image_path}")

        with Image.open(image_path) as img:
            return self.extract_text_from_pil_image(img)

    def extract_text_from_pil_image(self, image: Image.Image) -> str:
        """Extract text from a PIL Image object."""
        if not self.is_available:
            raise RuntimeError(
                "Tesseract OCR is not installed or not found on the system. "
                "Please install Tesseract OCR (e.g. from https://github.com/UB-Mannheim/tesseract/wiki on Windows) "
                "or specify TESSERACT_CMD in .env"
            )

        processed_image = self.preprocess_image(image)
        # Run OCR with page segmentation mode 3 (Fully automatic page segmentation)
        custom_config = r"--oem 3 --psm 3"
        text = pytesseract.image_to_string(processed_image, config=custom_config)
        return clean_extracted_text(text)

    def extract_text_from_images(self, images: List[Image.Image]) -> str:
        """Extract text from multiple PIL Images (e.g., pages of a scanned PDF)."""
        all_text = []
        for i, img in enumerate(images):
            page_text = self.extract_text_from_pil_image(img)
            if page_text:
                all_text.append(f"--- Page {i + 1} ---\n{page_text}")
        return "\n\n".join(all_text)


# Singleton instance
ocr_service = OCRService()

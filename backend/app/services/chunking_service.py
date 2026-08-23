"""Document chunking and hierarchical summarization for handling large documents."""

import logging
from typing import List

logger = logging.getLogger(__name__)

# Character limits for single-pass analysis vs hierarchical chunking
MAX_SINGLE_PASS_CHARS = 14000  # ~3500 words / ~4500 tokens
CHUNK_SIZE_CHARS = 10000       # Target size per chunk
CHUNK_OVERLAP_CHARS = 800      # Overlap to preserve boundary context


class ChunkingService:
    """Service to partition large texts into coherent chunks with overlap."""

    def split_text_into_chunks(
        self,
        text: str,
        chunk_size: int = CHUNK_SIZE_CHARS,
        overlap: int = CHUNK_OVERLAP_CHARS,
    ) -> List[str]:
        """Split long text into manageable chunks respecting paragraph and sentence boundaries."""
        if not text or len(text) <= chunk_size:
            return [text] if text else []

        chunks = []
        paragraphs = text.split("\n\n")
        current_chunk = []
        current_length = 0

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            para_len = len(para)

            # If a single paragraph itself is larger than chunk_size, split by sentences
            if para_len > chunk_size:
                sentences = self._split_sentences(para)
                for sentence in sentences:
                    sentence_len = len(sentence)
                    if current_length + sentence_len + 1 > chunk_size and current_chunk:
                        chunk_str = " ".join(current_chunk)
                        chunks.append(chunk_str)
                        # Keep overlap from the end of the previous chunk
                        overlap_chunk = self._extract_overlap(chunk_str, overlap)
                        current_chunk = [overlap_chunk, sentence] if overlap_chunk else [sentence]
                        current_length = sum(len(s) for s in current_chunk) + len(current_chunk) - 1
                    else:
                        current_chunk.append(sentence)
                        current_length += sentence_len + 1
            elif current_length + para_len + 2 > chunk_size and current_chunk:
                chunk_str = "\n\n".join(current_chunk)
                chunks.append(chunk_str)
                # Keep overlap
                overlap_chunk = self._extract_overlap(chunk_str, overlap)
                current_chunk = [overlap_chunk, para] if overlap_chunk else [para]
                current_length = sum(len(p) for p in current_chunk) + 2 * (len(current_chunk) - 1)
            else:
                current_chunk.append(para)
                current_length += para_len + 2

        if current_chunk:
            chunk_str = "\n\n".join(current_chunk)
            chunks.append(chunk_str)

        return chunks

    def _split_sentences(self, text: str) -> List[str]:
        """Split text roughly into sentences."""
        import re
        sentences = re.split(r"(?<=[.?!])\s+", text)
        return [s.strip() for s in sentences if s.strip()]

    def _extract_overlap(self, text: str, overlap_size: int) -> str:
        """Extract the last few sentences from text to serve as overlap for the next chunk."""
        if len(text) <= overlap_size:
            return text
        sentences = self._split_sentences(text)
        overlap_sentences = []
        accumulated = 0
        for s in reversed(sentences):
            if accumulated + len(s) + 1 > overlap_size and overlap_sentences:
                break
            overlap_sentences.insert(0, s)
            accumulated += len(s) + 1
        return " ".join(overlap_sentences)

    def is_large_document(self, text: str) -> bool:
        """Check if document exceeds single-pass threshold."""
        return len(text) > MAX_SINGLE_PASS_CHARS


# Singleton instance
chunking_service = ChunkingService()

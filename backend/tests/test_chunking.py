"""Unit tests for ChunkingService."""

from app.services.chunking_service import chunking_service


def test_small_text_no_chunking():
    """Short text should remain as a single chunk."""
    text = "This is a brief document with just one paragraph. Everything fits in a single chunk."
    chunks = chunking_service.split_text_into_chunks(text, chunk_size=1000)
    assert len(chunks) == 1
    assert chunks[0] == text


def test_large_text_chunking_with_overlap():
    """Large text should be partitioned into multiple chunks with overlap."""
    paras = [f"Paragraph {i}: This is detailed section content for testing chunking behavior with multiple sentences. Here is more context." for i in range(50)]
    large_text = "\n\n".join(paras)

    chunks = chunking_service.split_text_into_chunks(large_text, chunk_size=1000, overlap=100)
    assert len(chunks) > 1
    for chunk in chunks:
        assert len(chunk) > 0


def test_is_large_document_check():
    """Check threshold detection."""
    short_text = "Short text."
    assert not chunking_service.is_large_document(short_text)

    huge_text = "A" * 20000
    assert chunking_service.is_large_document(huge_text)

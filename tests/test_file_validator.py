import pytest
from app.services.file_validator import FileValidator

def test_unsupported_file_extension():
    res = FileValidator.validate_file(b"some content", "document.docx")
    assert not res.is_valid
    assert any("Unsupported file extension" in err for err in res.errors)

def test_empty_file():
    res = FileValidator.validate_file(b"", "invoice.pdf")
    assert not res.is_valid
    assert any("File is empty" in err for err in res.errors)

def test_file_size_exceeded():
    large_bytes = b"a" * (11 * 1024 * 1024)  # 11 MB
    res = FileValidator.validate_file(large_bytes, "invoice.jpg")
    assert not res.is_valid
    assert any("exceeds maximum allowed size" in err for err in res.errors)

def test_valid_image_extension():
    res = FileValidator.validate_file(b"fake image bytes", "receipt.png")
    assert res.is_valid
    assert res.file_type == "PNG"

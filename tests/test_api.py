import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_list_documents_endpoint():
    response = client.get("/api/v1/documents")
    assert response.status_code == 200
    data = response.json()
    assert "total_count" in data
    assert "documents" in data

def test_process_invalid_file_extension():
    files = {"file": ("test.docx", b"dummy docx text", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    response = client.post("/api/v1/documents/process", files=files)
    assert response.status_code == 400

def test_process_valid_image_document():
    # Simple 1x1 pixel JPEG byte stream
    sample_jpeg = (
        b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00'
        b'\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\x09\x09'
        b'\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f'
        b'\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff'
        b'\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f'
        b'\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00'
        b'\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08'
        b'\x01\x01\x00\x00?\x00\xbf\x00\xff\xd9'
    )
    files = {"file": ("test_invoice.jpg", sample_jpeg, "image/jpeg")}
    data = {"document_type": "INVOICE"}
    response = client.post("/api/v1/documents/process", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["document_name"] == "test_invoice.jpg"
    assert res_data["processing_status"] == "COMPLETED"

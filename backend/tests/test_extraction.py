import pytest
from backend.app.services.extraction_service import ExtractionService

def test_extraction_detect_type():
    data, doc_type, grounding, schema = ExtractionService.extract_structured_data(
        pages_content=[{"page_number": 1, "text": "TAX INVOICE Subtotal 100.00 Grand Total 100.00", "tables": []}],
        specified_document_type="AUTO_DETECT"
    )
    assert doc_type == "INVOICE"
    assert data is not None

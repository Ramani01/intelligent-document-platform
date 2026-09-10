import pytest
from backend.app.services.document_validation_service import DocumentValidationService
from backend.app.services.financial_validation_service import FinancialValidationService

def test_file_validation_unsupported_ext():
    res = DocumentValidationService.validate_file(b"test data", "doc.txt")
    assert not res.is_valid

def test_file_validation_empty():
    res = DocumentValidationService.validate_file(b"", "doc.pdf")
    assert not res.is_valid

def test_financial_validation_invoice_pass():
    data = {
        "line_items": [{"quantity": 2.0, "unit_price": 50.0, "line_total": 100.0}],
        "financials": {"subtotal": {"value": 100.0}, "grand_total": {"value": 100.0}}
    }
    summary = FinancialValidationService.validate(data, "INVOICE")
    assert summary.status == "PASS"

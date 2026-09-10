import pytest
from app.services.financial_validator import FinancialValidator

def test_invoice_validation_pass():
    data = {
        "line_items": [
            {"quantity": 2.0, "unit_price": 50.0, "line_total": 100.0},
            {"quantity": 1.0, "unit_price": 200.0, "line_total": 200.0}
        ],
        "financials": {
            "subtotal": {"value": 300.0},
            "total_tax": {"value": 30.0},
            "grand_total": {"value": 330.0}
        }
    }
    summary = FinancialValidator.validate(data, "INVOICE")
    assert summary.status == "PASS"
    assert len(summary.rules_executed) >= 3

def test_invoice_validation_fail_subtotal():
    data = {
        "line_items": [
            {"quantity": 2.0, "unit_price": 50.0, "line_total": 100.0}
        ],
        "financials": {
            "subtotal": {"value": 500.0},  # Mismatched subtotal
            "grand_total": {"value": 500.0}
        }
    }
    summary = FinancialValidator.validate(data, "INVOICE")
    assert summary.status == "FAILED"

def test_balance_sheet_validation_pass():
    data = {
        "comparative_years": ["2026", "2025"],
        "sections": [
            {
                "section_name": "CAPITAL AND LIABILITIES",
                "totals": {"2026": 10000.0, "2025": 9000.0}
            },
            {
                "section_name": "ASSETS",
                "totals": {"2026": 10000.0, "2025": 9000.0}
            }
        ]
    }
    summary = FinancialValidator.validate(data, "BALANCE_SHEET")
    assert summary.status == "PASS"

def test_balance_sheet_validation_fail():
    data = {
        "comparative_years": ["2026"],
        "sections": [
            {
                "section_name": "CAPITAL AND LIABILITIES",
                "totals": {"2026": 10000.0}
            },
            {
                "section_name": "ASSETS",
                "totals": {"2026": 8500.0}  # Mismatched Assets
            }
        ]
    }
    summary = FinancialValidator.validate(data, "BALANCE_SHEET")
    assert summary.status == "FAILED"

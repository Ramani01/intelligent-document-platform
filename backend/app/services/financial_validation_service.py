from typing import Dict, Any
from backend.app.schemas.document import FinancialValidationSummary
from app.services.financial_validator import FinancialValidator

class FinancialValidationService:
    @classmethod
    def validate(cls, extracted_data: Dict[str, Any], doc_type: str) -> FinancialValidationSummary:
        res = FinancialValidator.validate(extracted_data, doc_type)
        return FinancialValidationSummary.model_validate(res.model_dump())

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class FileValidationResult(BaseModel):
    is_valid: bool
    file_name: str
    file_type: str
    file_size_bytes: int
    page_count: int
    is_native_pdf: bool
    errors: List[str] = Field(default_factory=list)

class RuleAuditItem(BaseModel):
    rule_id: str
    description: str
    status: str = Field(..., description="PASS, FAILED, or NOT_APPLICABLE")
    calculated_value: Optional[float] = None
    expected_value: Optional[float] = None
    difference: Optional[float] = None

class FinancialValidationSummary(BaseModel):
    status: str = Field(..., description="PASS, FAILED, or NOT_APPLICABLE")
    summary: str
    rules_executed: List[RuleAuditItem] = Field(default_factory=list)

class ProcessingMetadata(BaseModel):
    processing_time_ms: int
    ocr_engine_used: str
    llm_model_used: str
    overall_confidence_score: float
    timestamp: str

class DocumentProcessingResponse(BaseModel):
    document_name: str
    document_type: str = Field(..., description="INVOICE, BALANCE_SHEET, PROFIT_AND_LOSS, CASH_FLOW")
    processing_status: str = Field(..., description="COMPLETED, FAILED")
    file_validation: FileValidationResult
    extracted_data: Dict[str, Any] = Field(default_factory=dict)
    validation: FinancialValidationSummary
    processing_metadata: ProcessingMetadata

class DocumentRecordSummary(BaseModel):
    id: int
    document_name: str
    document_type: str
    processing_status: str
    validation_status: str
    overall_confidence_score: float
    created_at: str

class DocumentListResponse(BaseModel):
    total_count: int
    limit: int
    offset: int
    documents: List[DocumentRecordSummary]

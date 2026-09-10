from dataclasses import dataclass
from typing import Optional

@dataclass
class DocumentRecordModel:
    id: Optional[int]
    document_name: str
    document_type: str
    processing_status: str
    validation_status: str
    overall_confidence_score: float
    file_validation_json: str
    extracted_data_json: str
    validation_results_json: str
    processing_metadata_json: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

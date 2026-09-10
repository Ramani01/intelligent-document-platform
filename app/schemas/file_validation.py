from typing import List, Optional
from pydantic import BaseModel, Field

class FileValidationResult(BaseModel):
    is_valid: bool = Field(..., description="Whether the file passes validation rules")
    file_name: str = Field(..., description="Original filename")
    file_type: str = Field(..., description="MIME type or file extension")
    file_size_bytes: int = Field(..., description="Size of file in bytes")
    page_count: int = Field(default=1, description="Number of pages in document")
    is_native_pdf: bool = Field(default=False, description="True if PDF contains extractable native text")
    errors: List[str] = Field(default_factory=list, description="List of validation errors if invalid")

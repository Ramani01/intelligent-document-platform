from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class FieldWrapper(BaseModel):
    value: Optional[Any] = None
    evidence: Optional[str] = None
    source_text: Optional[str] = None
    page_number: Optional[int] = 1
    confidence: Optional[float] = 1.0

class PartyDetails(BaseModel):
    name: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    address: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    tax_id: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    phone: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    email: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)

class InvoiceLineItem(BaseModel):
    item_number: Optional[str] = None
    description: Optional[str] = None
    hsn_sac: Optional[str] = None
    quantity: Optional[float] = None
    unit_of_measure: Optional[str] = None
    unit_price: Optional[float] = None
    discount: Optional[float] = None
    tax_rate: Optional[float] = None
    line_total: Optional[float] = None
    page_number: Optional[int] = 1
    confidence: Optional[float] = 1.0

class FinancialLineItem(BaseModel):
    line_item_name: str
    schedule_number: Optional[str] = None
    values: Dict[str, Optional[float]] = Field(default_factory=dict)
    page_number: Optional[int] = 1
    confidence: Optional[float] = 1.0

class FinancialSection(BaseModel):
    section_name: str
    line_items: List[FinancialLineItem] = Field(default_factory=list)
    totals: Dict[str, Optional[float]] = Field(default_factory=dict)

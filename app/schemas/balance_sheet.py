from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from app.schemas.invoice import FieldWrapper

class FinancialLineItem(BaseModel):
    line_item_name: str
    schedule_number: Optional[str] = None
    values: Dict[str, Optional[float]] = Field(default_factory=dict, description="Year -> Value mapping")
    page_number: Optional[int] = 1
    confidence: Optional[float] = 1.0

class FinancialSection(BaseModel):
    section_name: str
    line_items: List[FinancialLineItem] = Field(default_factory=list)
    totals: Dict[str, Optional[float]] = Field(default_factory=dict, description="Year -> Total mapping")

class BalanceSheetHeader(BaseModel):
    entity_name: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    as_at_date: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    scale_unit: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    currency: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)

class BalanceSheetExtractionData(BaseModel):
    header: BalanceSheetHeader = Field(default_factory=BalanceSheetHeader)
    comparative_years: List[str] = Field(default_factory=list, description="List of comparative year strings e.g. ['2026', '2025']")
    sections: List[FinancialSection] = Field(default_factory=list)
    notes_and_off_balance: List[FinancialLineItem] = Field(default_factory=list)

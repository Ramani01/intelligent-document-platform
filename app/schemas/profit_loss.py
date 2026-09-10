from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from app.schemas.invoice import FieldWrapper
from app.schemas.balance_sheet import FinancialSection, FinancialLineItem

class ProfitLossHeader(BaseModel):
    entity_name: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    period_ended_date: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    scale_unit: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    currency: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    share_face_value: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)

class EarningsPerShare(BaseModel):
    basic_eps: Dict[str, Optional[float]] = Field(default_factory=dict)
    diluted_eps: Dict[str, Optional[float]] = Field(default_factory=dict)

class ProfitLossExtractionData(BaseModel):
    header: ProfitLossHeader = Field(default_factory=ProfitLossHeader)
    comparative_years: List[str] = Field(default_factory=list)
    sections: List[FinancialSection] = Field(default_factory=list)
    earnings_per_share: EarningsPerShare = Field(default_factory=EarningsPerShare)

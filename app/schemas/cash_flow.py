from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from app.schemas.invoice import FieldWrapper
from app.schemas.balance_sheet import FinancialSection, FinancialLineItem

class CashFlowHeader(BaseModel):
    entity_name: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    period_ended_date: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    scale_unit: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    currency: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)

class CashFlowReconciliation(BaseModel):
    net_operating_cash_flow: Dict[str, Optional[float]] = Field(default_factory=dict)
    net_investing_cash_flow: Dict[str, Optional[float]] = Field(default_factory=dict)
    net_financing_cash_flow: Dict[str, Optional[float]] = Field(default_factory=dict)
    exchange_fluctuation_effect: Dict[str, Optional[float]] = Field(default_factory=dict)
    amalgamation_cash: Dict[str, Optional[float]] = Field(default_factory=dict)
    net_increase_in_cash: Dict[str, Optional[float]] = Field(default_factory=dict)
    opening_cash_equivalents: Dict[str, Optional[float]] = Field(default_factory=dict)
    ending_cash_equivalents: Dict[str, Optional[float]] = Field(default_factory=dict)

class CashFlowExtractionData(BaseModel):
    header: CashFlowHeader = Field(default_factory=CashFlowHeader)
    comparative_years: List[str] = Field(default_factory=list)
    sections: List[FinancialSection] = Field(default_factory=list)
    reconciliation: CashFlowReconciliation = Field(default_factory=CashFlowReconciliation)

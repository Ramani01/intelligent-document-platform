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

class InvoiceFinancials(BaseModel):
    subtotal: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    cgst: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    sgst: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    igst: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    vat: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    hst: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    total_tax: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    shipping_and_handling: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    rounding_adjustment: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    grand_total: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    total_in_words: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    cash_paid: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    change_returned: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)

class InvoiceHeader(BaseModel):
    invoice_number: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    issue_date: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    due_date: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    payment_terms: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    po_number: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    customer_account: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    currency: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)
    carrier: Optional[FieldWrapper] = Field(default_factory=FieldWrapper)

class InvoiceExtractionData(BaseModel):
    header: InvoiceHeader = Field(default_factory=InvoiceHeader)
    vendor: PartyDetails = Field(default_factory=PartyDetails)
    buyer: PartyDetails = Field(default_factory=PartyDetails)
    consignee: PartyDetails = Field(default_factory=PartyDetails)
    line_items: List[InvoiceLineItem] = Field(default_factory=list)
    financials: InvoiceFinancials = Field(default_factory=InvoiceFinancials)

import logging
from typing import Dict, Any, List, Optional
from app.schemas.response import FinancialValidationSummary, RuleAuditItem

logger = logging.getLogger("neostats.financial_validator")

TOLERANCE = 1.0

class FinancialValidator:
    @classmethod
    def validate(cls, extracted_data: Dict[str, Any], doc_type: str) -> FinancialValidationSummary:
        """
        Runs deterministic Python mathematical validation checks on extracted financial data.
        """
        if not extracted_data:
            return FinancialValidationSummary(
                status="NOT_APPLICABLE",
                summary="No structured extraction data available for validation.",
                rules_executed=[]
            )

        if doc_type == "INVOICE":
            return cls._validate_invoice(extracted_data)
        elif doc_type == "BALANCE_SHEET":
            return cls._validate_balance_sheet(extracted_data)
        elif doc_type == "PROFIT_AND_LOSS":
            return cls._validate_profit_loss(extracted_data)
        elif doc_type == "CASH_FLOW":
            return cls._validate_cash_flow(extracted_data)
        else:
            return FinancialValidationSummary(
                status="NOT_APPLICABLE",
                summary=f"Validation rules not defined for document type {doc_type}.",
                rules_executed=[]
            )

    @classmethod
    def _validate_invoice(cls, data: Dict[str, Any]) -> FinancialValidationSummary:
        rules: List[RuleAuditItem] = []
        financials = data.get("financials", {})
        line_items = data.get("line_items", [])

        # 1. Line item math: quantity * unit_price == line_total
        for idx, item in enumerate(line_items):
            qty = item.get("quantity")
            price = item.get("unit_price")
            total = item.get("line_total")
            
            if qty is not None and price is not None and total is not None:
                calc_total = qty * price
                diff = abs(calc_total - total)
                status = "PASS" if diff <= 0.05 else "FAILED"
                rules.append(RuleAuditItem(
                    rule_id=f"RULE_INV_LINE_{idx+1}_MATH",
                    description=f"Line Item #{idx+1} Math ({qty} * {price} == {total})",
                    status=status,
                    calculated_value=round(calc_total, 2),
                    expected_value=round(total, 2),
                    difference=round(diff, 2)
                ))
            else:
                rules.append(RuleAuditItem(
                    rule_id=f"RULE_INV_LINE_{idx+1}_MATH",
                    description=f"Line Item #{idx+1} Math check",
                    status="NOT_APPLICABLE"
                ))

        # Helper to extract scalar value from wrapper dict or raw value
        def get_val(obj):
            if isinstance(obj, dict):
                return obj.get("value")
            return obj

        subtotal_val = get_val(financials.get("subtotal"))
        grand_total_val = get_val(financials.get("grand_total"))
        total_tax_val = get_val(financials.get("total_tax")) or 0.0
        cgst_val = get_val(financials.get("cgst")) or 0.0
        sgst_val = get_val(financials.get("sgst")) or 0.0
        igst_val = get_val(financials.get("igst")) or 0.0
        vat_val = get_val(financials.get("vat")) or 0.0
        shipping_val = get_val(financials.get("shipping_and_handling")) or 0.0
        rounding_val = get_val(financials.get("rounding_adjustment")) or 0.0

        # 2. Subtotal Reconciliation: Sum(line_totals) == subtotal
        if line_items and subtotal_val is not None:
            sum_line_totals = sum(i.get("line_total") or 0.0 for i in line_items if i.get("line_total") is not None)
            if sum_line_totals > 0:
                diff_sub = abs(sum_line_totals - subtotal_val)
                status_sub = "PASS" if diff_sub <= TOLERANCE else "FAILED"
                rules.append(RuleAuditItem(
                    rule_id="RULE_INV_SUBTOTAL_SUM",
                    description="Sum of Line Item Totals == Subtotal",
                    status=status_sub,
                    calculated_value=round(sum_line_totals, 2),
                    expected_value=round(subtotal_val, 2),
                    difference=round(diff_sub, 2)
                ))
        else:
            rules.append(RuleAuditItem(
                rule_id="RULE_INV_SUBTOTAL_SUM",
                description="Sum of Line Item Totals == Subtotal",
                status="NOT_APPLICABLE"
            ))

        # 3. Grand Total Reconciliation: subtotal + taxes + shipping + rounding == grand_total
        if subtotal_val is not None and grand_total_val is not None:
            eff_tax = total_tax_val if total_tax_val > 0 else (cgst_val + sgst_val + igst_val + vat_val)
            calc_grand = subtotal_val + eff_tax + shipping_val + rounding_val
            diff_grand = abs(calc_grand - grand_total_val)
            status_grand = "PASS" if diff_grand <= TOLERANCE else "FAILED"
            rules.append(RuleAuditItem(
                rule_id="RULE_INV_GRAND_TOTAL_MATH",
                description="Subtotal + Taxes + Shipping + Rounding == Grand Total",
                status=status_grand,
                calculated_value=round(calc_grand, 2),
                expected_value=round(grand_total_val, 2),
                difference=round(diff_grand, 2)
            ))
        else:
            rules.append(RuleAuditItem(
                rule_id="RULE_INV_GRAND_TOTAL_MATH",
                description="Subtotal + Taxes + Shipping + Rounding == Grand Total",
                status="NOT_APPLICABLE"
            ))

        # 4. Dual GST equality: CGST == SGST
        if cgst_val > 0 and sgst_val > 0:
            diff_gst = abs(cgst_val - sgst_val)
            status_gst = "PASS" if diff_gst <= 0.05 else "FAILED"
            rules.append(RuleAuditItem(
                rule_id="RULE_INV_DUAL_GST",
                description="CGST == SGST Equality",
                status=status_gst,
                calculated_value=round(cgst_val, 2),
                expected_value=round(sgst_val, 2),
                difference=round(diff_gst, 2)
            ))

        return cls._summarize_rules(rules, "Invoice")

    @classmethod
    def _validate_balance_sheet(cls, data: Dict[str, Any]) -> FinancialValidationSummary:
        rules: List[RuleAuditItem] = []
        comp_years = data.get("comparative_years", ["2026", "2025"])
        sections = data.get("sections", [])

        liab_totals = {}
        asset_totals = {}

        for sec in sections:
            sec_name = sec.get("section_name", "").upper()
            totals = sec.get("totals", {})
            if "ASSET" in sec_name:
                asset_totals = totals
            else:
                liab_totals = totals

        for year in comp_years:
            l_val = liab_totals.get(year)
            a_val = asset_totals.get(year)

            if l_val is not None and a_val is not None:
                diff = abs(l_val - a_val)
                status = "PASS" if diff <= TOLERANCE else "FAILED"
                rules.append(RuleAuditItem(
                    rule_id=f"RULE_BS_EQUALITY_{year}",
                    description=f"Total Assets == Total Capital & Liabilities ({year})",
                    status=status,
                    calculated_value=round(a_val, 2),
                    expected_value=round(l_val, 2),
                    difference=round(diff, 2)
                ))
            else:
                rules.append(RuleAuditItem(
                    rule_id=f"RULE_BS_EQUALITY_{year}",
                    description=f"Total Assets == Total Capital & Liabilities ({year})",
                    status="NOT_APPLICABLE"
                ))

        return cls._summarize_rules(rules, "Balance Sheet")

    @classmethod
    def _validate_profit_loss(cls, data: Dict[str, Any]) -> FinancialValidationSummary:
        rules: List[RuleAuditItem] = []
        comp_years = data.get("comparative_years", ["2026", "2025"])
        sections = data.get("sections", [])

        for sec in sections:
            sec_name = sec.get("section_name", "").upper()
            line_items = sec.get("line_items", [])
            totals = sec.get("totals", {})

            for year in comp_years:
                sum_items = sum(item.get("values", {}).get(year) or 0.0 for item in line_items if item.get("values"))
                sec_tot = totals.get(year)
                if sec_tot is not None and len(line_items) > 0:
                    diff = abs(sum_items - sec_tot)
                    status = "PASS" if diff <= TOLERANCE else "FAILED"
                    rules.append(RuleAuditItem(
                        rule_id=f"RULE_PL_{sec_name[:3]}_SUM_{year}",
                        description=f"Sum of {sec_name} line items == Section Total ({year})",
                        status=status,
                        calculated_value=round(sum_items, 2),
                        expected_value=round(sec_tot, 2),
                        difference=round(diff, 2)
                    ))

        return cls._summarize_rules(rules, "Profit & Loss")

    @classmethod
    def _validate_cash_flow(cls, data: Dict[str, Any]) -> FinancialValidationSummary:
        rules: List[RuleAuditItem] = []
        comp_years = data.get("comparative_years", ["2026", "2025"])
        rec = data.get("reconciliation", {})

        for year in comp_years:
            op = rec.get("net_operating_cash_flow", {}).get(year) or 0.0
            inv = rec.get("net_investing_cash_flow", {}).get(year) or 0.0
            fin = rec.get("net_financing_cash_flow", {}).get(year) or 0.0
            fx = rec.get("exchange_fluctuation_effect", {}).get(year) or 0.0
            amal = rec.get("amalgamation_cash", {}).get(year) or 0.0
            net_inc = rec.get("net_increase_in_cash", {}).get(year)
            opening = rec.get("opening_cash_equivalents", {}).get(year)
            ending = rec.get("ending_cash_equivalents", {}).get(year)

            if net_inc is not None:
                calc_inc = op + inv + fin + fx + amal
                diff_inc = abs(calc_inc - net_inc)
                status_inc = "PASS" if diff_inc <= TOLERANCE else "FAILED"
                rules.append(RuleAuditItem(
                    rule_id=f"RULE_CF_NET_INCREASE_{year}",
                    description=f"Net Increase == Operating + Investing + Financing ({year})",
                    status=status_inc,
                    calculated_value=round(calc_inc, 2),
                    expected_value=round(net_inc, 2),
                    difference=round(diff_inc, 2)
                ))

            if ending is not None and opening is not None and net_inc is not None:
                calc_ending = opening + net_inc
                diff_end = abs(calc_ending - ending)
                status_end = "PASS" if diff_end <= TOLERANCE else "FAILED"
                rules.append(RuleAuditItem(
                    rule_id=f"RULE_CF_ENDING_CASH_{year}",
                    description=f"Ending Cash == Opening Cash + Net Increase ({year})",
                    status=status_end,
                    calculated_value=round(calc_ending, 2),
                    expected_value=round(ending, 2),
                    difference=round(diff_end, 2)
                ))

        return cls._summarize_rules(rules, "Cash Flow")

    @classmethod
    def _summarize_rules(cls, rules: List[RuleAuditItem], doc_label: str) -> FinancialValidationSummary:
        if not rules:
            return FinancialValidationSummary(
                status="NOT_APPLICABLE",
                summary=f"No mathematical validation rules could be applied to this {doc_label}.",
                rules_executed=[]
            )

        failed_count = sum(1 for r in rules if r.status == "FAILED")
        pass_count = sum(1 for r in rules if r.status == "PASS")
        na_count = sum(1 for r in rules if r.status == "NOT_APPLICABLE")

        if failed_count > 0:
            final_status = "FAILED"
            summary = f"Financial validation failed: {failed_count} rule(s) failed out of {len(rules)} executed."
        elif pass_count > 0:
            final_status = "PASS"
            summary = f"All {pass_count} applicable financial validation rules passed cleanly."
        else:
            final_status = "NOT_APPLICABLE"
            summary = f"Financial validation not applicable (insufficient populated fields)."

        return FinancialValidationSummary(
            status=final_status,
            summary=summary,
            rules_executed=rules
        )

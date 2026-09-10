import time
import datetime
import logging
from typing import Dict, Any, Optional
from app.schemas.file_validation import FileValidationResult
from app.schemas.response import DocumentProcessingResponse, ProcessingMetadata, FinancialValidationSummary
from app.services.file_validator import FileValidator
from app.services.pdf_extractor import PDFExtractor
from app.services.ocr_engine import OCREngine
from app.services.ai_extractor import AIExtractor
from app.services.financial_validator import FinancialValidator
from app.repositories.document_repo import DocumentRepository

logger = logging.getLogger("neostats.orchestrator")

class DocumentOrchestrator:
    @classmethod
    def process_document(
        cls, 
        file_bytes: bytes, 
        filename: str, 
        specified_document_type: str = "AUTO_DETECT"
    ) -> DocumentProcessingResponse:
        """
        Orchestrates end-to-end document processing:
        File Validation -> Text/OCR Extraction -> AI Extraction -> Math Validation -> DB Storage.
        """
        start_time = time.time()
        timestamp_str = datetime.datetime.utcnow().isoformat() + "Z"

        # Step 1: File & Format Validation
        file_val: FileValidationResult = FileValidator.validate_file(file_bytes, filename)
        if not file_val.is_valid:
            elapsed_ms = int((time.time() - start_time) * 1000)
            res = DocumentProcessingResponse(
                document_name=filename,
                document_type=specified_document_type if specified_document_type != "AUTO_DETECT" else "UNKNOWN",
                processing_status="FAILED",
                file_validation=file_val,
                extracted_data={},
                validation=FinancialValidationSummary(
                    status="NOT_APPLICABLE",
                    summary="Document failed file level validation rules.",
                    rules_executed=[]
                ),
                processing_metadata=ProcessingMetadata(
                    processing_time_ms=elapsed_ms,
                    ocr_engine_used="None",
                    llm_model_used="None",
                    overall_confidence_score=0.0,
                    timestamp=timestamp_str
                )
            )
            DocumentRepository.save_document_record(res)
            return res

        # Step 2: Text Extraction & OCR
        pages_content = []
        ocr_engine_used = "Native PDF Extractor"
        c_ocr = 1.0

        ext = file_val.file_type.lower()
        if ext == "pdf":
            if file_val.is_native_pdf:
                pages_content = PDFExtractor.extract_text_from_pdf(file_bytes)
                ocr_engine_used = "pdfplumber (Native PDF)"
                c_ocr = 1.0
            else:
                pages_content = OCREngine.process_scanned_pdf(file_bytes, filename)
                ocr_engine_used = "Tesseract-OCR (Scanned PDF)"
                c_ocr = 0.90
        else: # Image JPG / PNG
            pages_content = OCREngine.process_image(file_bytes, filename)
            ocr_engine_used = "Tesseract-OCR (Raster Image)"
            c_ocr = 0.88

        # Step 3: AI Extraction & Schema Engine
        extracted_data, doc_type, c_grounding, c_schema = AIExtractor.extract_structured_data(
            pages_content=pages_content,
            specified_document_type=specified_document_type
        )

        # Step 4: Deterministic Financial Validation
        validation_summary: FinancialValidationSummary = FinancialValidator.validate(extracted_data, doc_type)

        # Step 5: Multi-Factor Confidence Score Computation
        c_val = 1.0 if validation_summary.status == "PASS" else (0.5 if validation_summary.status == "NOT_APPLICABLE" else 0.0)
        
        # Confidence Formula: (0.30 * C_ocr) + (0.30 * C_grounding) + (0.20 * C_schema) + (0.20 * C_val)
        overall_confidence = round(
            (0.30 * c_ocr) + (0.30 * c_grounding) + (0.20 * c_schema) + (0.20 * c_val), 
            2
        )

        elapsed_ms = int((time.time() - start_time) * 1000)

        # Build Response Payload
        response = DocumentProcessingResponse(
            document_name=filename,
            document_type=doc_type,
            processing_status="COMPLETED",
            file_validation=file_val,
            extracted_data=extracted_data,
            validation=validation_summary,
            processing_metadata=ProcessingMetadata(
                processing_time_ms=elapsed_ms,
                ocr_engine_used=ocr_engine_used,
                llm_model_used="gemini-2.5-flash",
                overall_confidence_score=overall_confidence,
                timestamp=timestamp_str
            )
        )

        # Save record in database
        try:
            DocumentRepository.save_document_record(response)
        except Exception as e:
            logger.error(f"Error persisting document record to DB: {e}")

        return response

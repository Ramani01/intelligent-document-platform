import time
import datetime
import logging
from backend.app.schemas.document import DocumentProcessingResponse, ProcessingMetadata, FinancialValidationSummary
from backend.app.services.document_validation_service import DocumentValidationService
from backend.app.services.ocr_service import OCRService
from backend.app.services.extraction_service import ExtractionService
from backend.app.services.financial_validation_service import FinancialValidationService
from backend.app.repositories.document_repository import DocumentRepository

logger = logging.getLogger("neostats.document_service")

class DocumentService:
    @classmethod
    def process_document(
        cls, 
        file_bytes: bytes, 
        filename: str, 
        specified_document_type: str = "AUTO_DETECT"
    ) -> DocumentProcessingResponse:
        start_time = time.time()
        timestamp_str = datetime.datetime.utcnow().isoformat() + "Z"

        # Step 1: File Validation
        file_val = DocumentValidationService.validate_file(file_bytes, filename)
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

        # Step 2: OCR / Text Extraction
        pages_content = []
        ocr_engine_used = "Native PDF Extractor"
        c_ocr = 1.0

        ext = file_val.file_type.lower()
        if ext == "pdf":
            if file_val.is_native_pdf:
                pages_content = OCRService.extract_text_from_native_pdf(file_bytes)
                ocr_engine_used = "pdfplumber (Native PDF)"
                c_ocr = 1.0
            else:
                pages_content = OCRService.process_scanned_pdf(file_bytes, filename)
                ocr_engine_used = "Tesseract-OCR (Scanned PDF)"
                c_ocr = 0.90
        else:
            pages_content = OCRService.process_image(file_bytes, filename)
            ocr_engine_used = "Tesseract-OCR (Raster Image)"
            c_ocr = 0.88

        # Step 3: AI Extraction
        extracted_data, doc_type, c_grounding, c_schema = ExtractionService.extract_structured_data(
            pages_content=pages_content,
            specified_document_type=specified_document_type
        )

        # Step 4: Math Validation
        validation_summary = FinancialValidationService.validate(extracted_data, doc_type)

        # Step 5: Multi-Factor Confidence Score
        c_val = 1.0 if validation_summary.status == "PASS" else (0.5 if validation_summary.status == "NOT_APPLICABLE" else 0.0)
        overall_confidence = round(
            (0.30 * c_ocr) + (0.30 * c_grounding) + (0.20 * c_schema) + (0.20 * c_val), 
            2
        )

        elapsed_ms = int((time.time() - start_time) * 1000)

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

        try:
            DocumentRepository.save_document_record(response)
        except Exception as e:
            logger.error(f"Error persisting document record to DB: {e}")

        return response

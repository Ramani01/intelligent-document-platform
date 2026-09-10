from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException, status
from app.schemas.response import DocumentProcessingResponse, DocumentListResponse
from app.services.document_orchestrator import DocumentOrchestrator
from app.repositories.document_repo import DocumentRepository

router = APIRouter()

@router.post("/documents/process", response_model=DocumentProcessingResponse, summary="Ingest & Process Financial Document")
async def process_document(
    file: UploadFile = File(...),
    document_type: Optional[str] = Form("AUTO_DETECT")
):
    """
    Ingests PDF/Image financial document, validates file limits, executes text extraction & OCR,
    extracts structured schema via LLM/Pattern AI, runs pure Python financial validation, and stores record.
    """
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File payload missing or filename empty."
        )

    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read file contents: {str(e)}"
        )

    doc_type = document_type or "AUTO_DETECT"
    response = DocumentOrchestrator.process_document(
        file_bytes=file_bytes,
        filename=file.filename,
        specified_document_type=doc_type
    )

    if not response.file_validation.is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "File validation failed.",
                "errors": response.file_validation.errors,
                "file_validation": response.file_validation.model_dump()
            }
        )

    return response

@router.get("/documents/{document_name}", summary="Get Latest Document Record by Name")
def get_document_by_name(document_name: str):
    """
    Retrieves the latest processed JSON record for a given document name.
    """
    record = DocumentRepository.get_latest_document_by_name(document_name)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No processed record found for document name '{document_name}'."
        )
    return record

@router.get("/documents", response_model=DocumentListResponse, summary="List Processed Documents")
def list_documents(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    document_type: Optional[str] = Query(None)
):
    """
    Retrieves a paginated list of processed document summaries.
    """
    return DocumentRepository.list_documents(limit=limit, offset=offset, document_type=document_type)

import json
import logging
from typing import List, Optional, Dict, Any
from backend.app.core.database import get_db_connection
from backend.app.schemas.document import DocumentProcessingResponse, DocumentRecordSummary, DocumentListResponse

logger = logging.getLogger("neostats.document_repository")

class DocumentRepository:
    @staticmethod
    def save_document_record(response: DocumentProcessingResponse) -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        doc_name = response.document_name
        doc_type = response.document_type
        proc_status = response.processing_status
        val_status = response.validation.status
        conf_score = response.processing_metadata.overall_confidence_score
        
        file_val_json = response.file_validation.model_dump_json()
        extracted_json = json.dumps(response.extracted_data)
        val_results_json = response.validation.model_dump_json()
        proc_meta_json = response.processing_metadata.model_dump_json()
        
        cursor.execute("""
            INSERT INTO document_records (
                document_name, document_type, processing_status, validation_status,
                overall_confidence_score, file_validation_json, extracted_data_json,
                validation_results_json, processing_metadata_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc_name, doc_type, proc_status, val_status, conf_score,
            file_val_json, extracted_json, val_results_json, proc_meta_json
        ))
        
        conn.commit()
        record_id = cursor.lastrowid
        conn.close()
        logger.info(f"Saved document record for '{doc_name}' with ID {record_id}.")
        return record_id

    @staticmethod
    def get_latest_document_by_name(document_name: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM document_records
            WHERE document_name = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 1
        """, (document_name,))
        
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return None
            
        return {
            "document_name": row["document_name"],
            "document_type": row["document_type"],
            "processing_status": row["processing_status"],
            "file_validation": json.loads(row["file_validation_json"]),
            "extracted_data": json.loads(row["extracted_data_json"]),
            "validation": json.loads(row["validation_results_json"]),
            "processing_metadata": json.loads(row["processing_metadata_json"])
        }

    @staticmethod
    def list_documents(limit: int = 50, offset: int = 0, document_type: Optional[str] = None) -> DocumentListResponse:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if document_type:
            cursor.execute("SELECT COUNT(*) FROM document_records WHERE document_type = ?", (document_type,))
            total_count = cursor.fetchone()[0]
            cursor.execute("""
                SELECT id, document_name, document_type, processing_status, validation_status, overall_confidence_score, created_at
                FROM document_records
                WHERE document_type = ?
                ORDER BY id DESC
                LIMIT ? OFFSET ?
            """, (document_type, limit, offset))
        else:
            cursor.execute("SELECT COUNT(*) FROM document_records")
            total_count = cursor.fetchone()[0]
            cursor.execute("""
                SELECT id, document_name, document_type, processing_status, validation_status, overall_confidence_score, created_at
                FROM document_records
                ORDER BY id DESC
                LIMIT ? OFFSET ?
            """, (limit, offset))
            
        rows = cursor.fetchall()
        conn.close()
        
        docs = [
            DocumentRecordSummary(
                id=row["id"],
                document_name=row["document_name"],
                document_type=row["document_type"],
                processing_status=row["processing_status"],
                validation_status=row["validation_status"],
                overall_confidence_score=row["overall_confidence_score"],
                created_at=str(row["created_at"])
            ) for row in rows
        ]
        
        return DocumentListResponse(
            total_count=total_count,
            limit=limit,
            offset=offset,
            documents=docs
        )

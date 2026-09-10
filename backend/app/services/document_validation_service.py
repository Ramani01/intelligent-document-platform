import os
import pypdf
import io
from typing import Tuple, Optional
from backend.app.core.config import settings
from backend.app.schemas.document import FileValidationResult

class DocumentValidationService:
    @staticmethod
    def validate_file(file_bytes: bytes, filename: str, content_type: Optional[str] = None) -> FileValidationResult:
        errors = []
        ext = os.path.splitext(filename)[1].lower()
        size_bytes = len(file_bytes)
        
        # 1. Check Extension
        if ext not in settings.ALLOWED_EXTENSIONS:
            errors.append(f"Unsupported file extension '{ext}'. Allowed extensions are: {', '.join(sorted(settings.ALLOWED_EXTENSIONS))}")
        
        # 2. Check File Size
        if size_bytes == 0:
            errors.append("File is empty (0 bytes).")
        elif size_bytes > settings.MAX_FILE_SIZE_BYTES:
            errors.append(f"File size ({size_bytes / (1024*1024):.2f} MB) exceeds maximum allowed size of {settings.MAX_FILE_SIZE_BYTES / (1024*1024):.0f} MB.")
            
        page_count = 1
        is_native_pdf = False
        
        # 3. PDF specific checks
        if ext == '.pdf':
            try:
                pdf_stream = io.BytesIO(file_bytes)
                reader = pypdf.PdfReader(pdf_stream)
                page_count = len(reader.pages)
                
                if page_count > settings.MAX_PDF_PAGES:
                    errors.append(f"Document has {page_count} pages, which exceeds the maximum allowed limit of {settings.MAX_PDF_PAGES} pages.")
                
                total_text = ""
                for page in reader.pages:
                    total_text += (page.extract_text() or "")
                
                if len(total_text.strip()) > 50:
                    is_native_pdf = True
                    
            except Exception as e:
                errors.append(f"Corrupted or invalid PDF file: {str(e)}")
                
        is_valid = (len(errors) == 0)
        
        return FileValidationResult(
            is_valid=is_valid,
            file_name=filename,
            file_type=ext.replace('.', '').upper(),
            file_size_bytes=size_bytes,
            page_count=page_count,
            is_native_pdf=is_native_pdf,
            errors=errors
        )

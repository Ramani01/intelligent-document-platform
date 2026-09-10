import io
from typing import List, Dict, Any
import pdfplumber
import pypdf

class PDFExtractor:
    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> List[Dict[str, Any]]:
        """
        Extract text page-by-page from a native PDF using pdfplumber.
        Returns a list of dicts: [{'page_number': 1, 'text': '...', 'tables': [...]}]
        """
        pages_content = []
        try:
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                for idx, page in enumerate(pdf.pages):
                    page_text = page.extract_text() or ""
                    tables = page.extract_tables() or []
                    pages_content.append({
                        "page_number": idx + 1,
                        "text": page_text,
                        "tables": tables
                    })
        except Exception as e:
            # Fallback to pypdf if pdfplumber encounters errors
            pdf_stream = io.BytesIO(pdf_bytes)
            reader = pypdf.PdfReader(pdf_stream)
            for idx, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages_content.append({
                    "page_number": idx + 1,
                    "text": text,
                    "tables": []
                })
                
        return pages_content

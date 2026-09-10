import io
import os
from typing import List, Dict, Any
from PIL import Image
import pypdfium2 as pdfium
import pdfplumber
import pypdf

class OCRService:
    @staticmethod
    def extract_text_from_native_pdf(pdf_bytes: bytes) -> List[Dict[str, Any]]:
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
        except Exception:
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

    @staticmethod
    def _ocr_pil_image(image: Image.Image) -> str:
        try:
            import pytesseract
            text = pytesseract.image_to_string(image, config="--psm 6")
            if text and len(text.strip()) > 10:
                return text.strip()
            text_psm3 = pytesseract.image_to_string(image, config="--psm 3")
            return text_psm3.strip()
        except Exception:
            pass
            
        try:
            import tempfile, subprocess
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                tmp_path = tmp.name
                image.save(tmp_path)
            
            ps_script = f"""
            [Windows.Media.Ocr.OcrEngine, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
            [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
            [Windows.Storage.StorageFile, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
            
            $file = [Windows.Storage.StorageFile]::GetFileFromPathAsync('{tmp_path}').GetAwaiter().GetResult()
            $stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
            $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
            $bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()
            $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
            $result = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
            Write-Output $result.Text
            """
            proc = subprocess.run(["powershell", "-Command", ps_script], capture_output=True, text=True, timeout=10)
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            if proc.returncode == 0 and proc.stdout.strip():
                return proc.stdout.strip()
        except Exception:
            pass
            
        return ""

    @classmethod
    def process_image(cls, image_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        try:
            image = Image.open(io.BytesIO(image_bytes))
            text = cls._ocr_pil_image(image)
            return [{
                "page_number": 1,
                "text": text,
                "tables": []
            }]
        except Exception as e:
            raise RuntimeError(f"OCR processing failed for image {filename}: {str(e)}")

    @classmethod
    def process_scanned_pdf(cls, pdf_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        pages_content = []
        try:
            pdf = pdfium.PdfDocument(pdf_bytes)
            for page_idx, page in enumerate(pdf):
                pil_image = page.render(scale=3).to_pil()
                text = cls._ocr_pil_image(pil_image)
                pages_content.append({
                    "page_number": page_idx + 1,
                    "text": text,
                    "tables": []
                })
        except Exception as e:
            raise RuntimeError(f"OCR processing failed for scanned PDF {filename}: {str(e)}")
            
        return pages_content

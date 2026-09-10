import io
import os
from typing import List, Dict, Any
from PIL import Image
import pypdfium2 as pdfium

class OCREngine:
    @staticmethod
    def _ocr_pil_image(image: Image.Image) -> str:
        """
        Runs OCR on a PIL Image object. Uses pytesseract if available,
        or image layout/text extraction fallback.
        """
        try:
            import pytesseract
            # Configure psm 6 (assume uniform block of text)
            text = pytesseract.image_to_string(image, config="--psm 6")
            if text and len(text.strip()) > 10:
                return text.strip()
            # Try psm 3 as secondary configuration
            text_psm3 = pytesseract.image_to_string(image, config="--psm 3")
            return text_psm3.strip()
        except Exception as e:
            # Fallback if pytesseract binary is not configured in PATH
            pass
            
        # Try Windows OCR if running on Windows
        try:
            import tempfile, subprocess
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                tmp_path = tmp.name
                image.save(tmp_path)
            
            # Run PowerShell inline OCR helper if available
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
        """
        Runs OCR on a raster image file (JPG, PNG).
        """
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
        """
        Renders scanned PDF pages at 300 DPI using pypdfium2 and runs OCR on each page.
        """
        pages_content = []
        try:
            pdf = pdfium.PdfDocument(pdf_bytes)
            for page_idx, page in enumerate(pdf):
                # Render page to PIL Image at scale=3 (approx 300 DPI)
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

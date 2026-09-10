import json
import re
import logging
from typing import List, Dict, Any, Tuple
from backend.app.core.config import settings
from app.services.ai_extractor import AIExtractor

logger = logging.getLogger("neostats.extraction_service")

class ExtractionService:
    @classmethod
    def extract_structured_data(
        cls, 
        pages_content: List[Dict[str, Any]], 
        specified_document_type: str = "AUTO_DETECT"
    ) -> Tuple[Dict[str, Any], str, float, float]:
        """
        Delegates to AI Extractor engine.
        """
        return AIExtractor.extract_structured_data(
            pages_content=pages_content,
            specified_document_type=specified_document_type
        )

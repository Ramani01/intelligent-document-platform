import datetime
from fastapi import APIRouter
from app.config import settings

router = APIRouter()

@router.get("/health", summary="Health Check Endpoint")
def health_check():
    """
    Returns system operational health, version, and timestamp.
    """
    return {
        "status": "healthy",
        "project_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

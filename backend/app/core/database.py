import sqlite3
import logging
from backend.app.core.config import settings

logger = logging.getLogger("neostats.database")
DB_FILE_PATH = "./documents.db"

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='document_records';")
    if not cursor.fetchone():
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS document_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_name VARCHAR(255) NOT NULL,
            document_type VARCHAR(50) NOT NULL,
            processing_status VARCHAR(50) NOT NULL,
            validation_status VARCHAR(50) NOT NULL,
            overall_confidence_score REAL NOT NULL DEFAULT 0.0,
            file_validation_json TEXT NOT NULL,
            extracted_data_json TEXT,
            validation_results_json TEXT,
            processing_metadata_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_doc_name ON document_records(document_name);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_doc_type ON document_records(document_type);")
        conn.commit()
    return conn

def init_db():
    conn = get_db_connection()
    conn.close()
    logger.info("Database initialized successfully.")

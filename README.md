<<<<<<< HEAD
# intelligent-document-platform
=======
# Neostats - Intelligent Document Extraction, Validation & API Platform

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

An enterprise-grade document intelligence platform designed to ingest, process, validate, extract, and reconcile complex financial documents including **Invoices**, **Balance Sheets**, **Profit & Loss Accounts**, and **Cash Flow Statements**.

---

## 🌟 Key System Capabilities

- **Multi-Format Ingestion**: Supports `.pdf`, `.jpg`, `.jpeg`, `.png` files up to 10 MB and max 3 pages per request.
- **Dual Text & OCR Pipeline**: Automatically routes native vector PDFs to direct text extractors (`pdfplumber` / `pypdf`) and scanned documents to OCR (`Tesseract` / `pypdfium2`).
- **AI-Powered Structured Extraction**: Leverages Large Language Models (Google Gemini) with strict Pydantic schemas and structured pattern fallbacks for zero hallucination.
- **Deterministic Financial Validation**: Executes pure Python mathematical verification for:
  - **Invoices**: Line item math (`Qty * Rate == Total`), Subtotal sum, Grand total reconciliation (`Subtotal + Tax + Rounding == Grand Total`).
  - **Balance Sheets**: Accounting equation equality (`Assets == Liabilities + Equity`) for all comparative periods.
  - **Profit & Loss**: Income sum, Expenditure sum, and profit reconciliations.
  - **Cash Flows**: Cash increase reconciliation (`Net Increase == Operating + Investing + Financing + FX + Amalgamation`) and ending cash balance (`Ending == Opening + Net Increase`).
- **Explainable Multi-Factor Confidence Score**:
  $$\text{Confidence Score} = (0.30 \times C_{\text{OCR}}) + (0.30 \times C_{\text{Grounding}}) + (0.20 \times C_{\text{Schema}}) + (0.20 \times C_{\text{Validation}})$$
- **RESTful API Gateway**: High-throughput FastAPI endpoints with persistent SQLite database storage and latest record retrieval logic.
- **Modern Glassmorphic React Dashboard**: Sleek React/Vite dashboard featuring drag-and-drop file uploader, JSON tree inspector, math audit rule table, and paginated document repository explorer.

---

## 🛠️ System Architecture

```
[User Upload / API Client] 
           │
           ▼
1. File Validation Engine (Extension, Size < 10MB, Page Count ≤ 3)
           │
           ▼
2. Text Extraction & OCR Engine (pdfplumber / pypdfium2 + Tesseract)
           │
           ▼
3. AI Extraction Strategy (Gemini LLM / Structured Pattern Extractor)
           │
           ▼
4. Deterministic Financial Validator (Pure Python Numerical Equality Rules)
           │
           ▼
5. Evidence & Multi-Factor Confidence Scoring Engine
           │
           ▼
6. Storage & REST Gateway (SQLite Database & FastAPI Endpoints)
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+ (for frontend dashboard)

### 1. Clone & Setup Backend

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI application server
uvicorn app.main:app --reload --port 8000
```
- Open Swagger UI API Docs at: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### 2. Setup & Launch Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
```
- Open Dashboard at: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Running Automated Tests

Run the full pytest suite (12 test scenarios):

```bash
python -m pytest tests/ -v
```

---

## 📡 API Reference Specification

### `POST /api/v1/documents/process`
Ingest and process a financial document file.
- **Parameters**: `file` (UploadFile), `document_type` (Optional: `INVOICE`, `BALANCE_SHEET`, `PROFIT_AND_LOSS`, `CASH_FLOW`, `AUTO_DETECT`)
- **Returns**: Complete validated document JSON response.

### `GET /api/v1/documents/{document_name}`
Retrieve the latest processing result for a given document filename.

### `GET /api/v1/documents`
List paginated document record summaries (`limit`, `offset`, `document_type`).

### `GET /api/v1/health`
Health check status endpoint.
>>>>>>> e40c899 (feat: complete intelligent document extraction, validation and API platform)

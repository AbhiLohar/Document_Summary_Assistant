# Document Summary Assistant 📄✨

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://document-summary-assistant-ecru.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev)
[![KaTeX](https://img.shields.io/badge/KaTeX-Math_Rendering-319795?style=for-the-badge&logo=latex&logoColor=white)](https://katex.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An intelligent, full-stack document analysis web application that ingests PDFs and image documents, extracts high-fidelity text using **PyMuPDF** and **Tesseract OCR**, performs hierarchical document chunking, and leverages the **Google Gemini API** with structured JSON output and **KaTeX** math formatting to generate pristine executive summaries, key takeaways, dynamic outlines, and actionable editorial recommendations.

---

## 🌐 Live Application

> ### 🔗 **[Click Here to Open the Live Web Application](https://document-summary-assistant-ecru.vercel.app/)**
> **Deployment Status:** Active & Production-Ready  
> **Frontend:** Hosted on **Vercel**  
> **Backend:** Hosted on **Render** (FastAPI Python 3.12)

---

## 🌟 Executive Summary

> **The Problem:** Professionals, researchers, and students face information overload, spending hours parsing lengthy PDFs, research papers, financial reports, and scanned whiteboard notes to extract core takeaways.
>
> **The Solution:** The **Document Summary Assistant** automates document comprehension from end to end. Users upload native PDFs, scanned documents, or images. The platform extracts text via PyMuPDF or Tesseract OCR, performs map-reduce chunking for large multi-page documents, and queries Google Gemini AI using schema-constrained JSON mode to produce structured summaries, key takeaways, dynamic thematic outlines, and editorial improvement suggestions.
>
> **Two-Pipeline Architecture:**
> - **Pipeline A (Source Extraction):** 100% faithful extraction preserved in the Raw Text Drawer without stripping symbols, formulas, or currency (`$`, `*`, LaTeX, code).
> - **Pipeline B (AI Analysis):** Strict schema-validated JSON with zero prompt leakage, KaTeX mathematical typography, and clean semantic presentation.

---

## 🚀 Key Features

* **Multi-Format Ingestion**: Supports `.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, and `.tiff` documents up to 25MB.
* **Dual Native & OCR Extraction**:
  * **PyMuPDF (`fitz`)**: Lightning-fast vector text extraction preserving paragraph hierarchy and layout flow.
  * **Tesseract OCR Engine**: Preprocessed optical character recognition for scanned receipts, whiteboard notes, and screenshots.
  * **Automatic Scanned PDF Detection**: Evaluates character density per page and triggers OCR fallback when text is embedded as scanned bitmaps.
* **Variable AI Summary Modes**:
  * **Short**: Concise, punchy sentences focusing strictly on core conclusions.
  * **Medium**: Balanced executive briefing with background context, mechanics, and outcomes.
  * **Long**: In-depth multi-section brief covering detailed nuances, metrics, and methodology.
  * *Live Instant Re-Summarization*: Switch lengths instantly without re-uploading the source document.
* **Semantic Key Takeaways**: Clean standalone insights with custom numbering (`01`, `02`, `03`) and zero raw formatting clutter.
* **Dynamic Main Ideas & Outline**: Identifies real document sections and topics (e.g., Problem Context, Query Mechanics, Constraints) rather than generic headings.
* **Editorial Improvement Suggestions**: Identifies clarity gaps, structural bottlenecks, or explicitly recognizes well-written documents.
* **KaTeX LaTeX Math & Currency Support**: Renders inline & display math formulas (e.g., `$1 \le x, y \le 10^9$`, `$a_1, a_2, \dots, a_n$`) seamlessly while keeping currencies (`$500`, `\$100`) intact.
* **Anti-Prompt-Leakage & Safety**: `<UNTRUSTED_DOCUMENT_CONTENT>` boundary protection prevents prompt injection from altering AI behavior.
* **Multi-Format Exporting**: Download reports as Markdown (`.md`), Plain Text (`.txt`), Structured JSON (`.json`), or formatted PDF Print.
* **Text-to-Speech (TTS)**: Built-in voice synthesizer to listen to executive summaries.
* **Dark / Light Mode**: Modern dark/light visual design with system preference detection and localStorage persistence.

---

## 🏛️ System Architecture

```text
                                  User Browser
                                       │
                      ┌────────────────┴────────────────┐
                      ▼                                 ▼
             [Drag & Drop Upload]             [Length Selector / UI]
                      │                                 │
                      └────────────────┬────────────────┘
                                       │  REST API (Axios / CORS)
                                       ▼
                             FastAPI Backend
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
           [File Validation]                     [Health & Routing]
                    │                                     │
                    ▼                                     │
         Is File PDF or Image?                            │
           ├── PDF (Native Text) ──► PyMuPDF Extraction   │
           └── Scanned / Image   ──► Tesseract OCR Engine │
                    │                                     │
                    ▼                                     │
          [Text Normalization]                            │
                    │                                     │
                    ▼                                     │
          Is Document Large (>14k chars)?                 │
           ├── Yes ──► Map-Reduce Hierarchical Chunks     │
           └── No  ──► Single-Pass Analysis               │
                    │                                     │
                    ▼                                     │
          Google Gemini AI Model                          │
          (gemini-2.0-flash / gemini-1.5-flash)           │
                    │                                     │
                    ▼                                     │
          [Strict responseSchema JSON Output]             │
          • Summary (Short / Med / Long)                  │
          • Key Takeaways (Clean prose)                   │
          • Main Ideas / Topics (Grounded)                │
          • Improvement Suggestions (Actionable)          │
                    │                                     │
                    ▼                                     │
          [Decontamination & Validation]                  │
                    │                                     │
                    ▼                                     │
             React Dashboard ◄────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite | Blazing fast build tooling, component modularity, instant HMR |
| **Styling & Icons** | Tailwind CSS, Lucide React | Responsive layout, dark/light theme tokens, clean accessible design |
| **Math Typography** | KaTeX, Remark-Math, Rehype-KaTeX | Native rendering of LaTeX math expressions and formulas |
| **Backend API** | FastAPI (Python 3.12) | Asynchronous execution, automatic OpenAPI docs, Pydantic type safety |
| **PDF Extraction** | PyMuPDF (`fitz`) | High-speed, accurate multi-page layout and text extraction |
| **OCR Engine** | Tesseract OCR (`pytesseract` + Pillow) | Open-source OCR with image preprocessing (grayscale, contrast boost) |
| **AI / LLM** | Google Gemini API (`responseSchema` JSON) | Structured outputs, generous free tier, 1M+ token context window |
| **Testing** | Pytest, FastAPI TestClient | 18 comprehensive automated unit & integration test suites |

---

## 💻 Local Installation & Setup

### Prerequisites
- **Python 3.11+ or 3.12+**
- **Node.js v18+ or v20+**
- *(Optional for image OCR)*: **Tesseract OCR**
  - **Windows**: Download installer from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki)
  - **macOS**: `brew install tesseract`
  - **Ubuntu/Debian**: `sudo apt-get install -y tesseract-ocr`

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Edit `backend/.env` and insert your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
PORT=8000
```
> 💡 *Don't have a key? Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).*

```bash
# Start FastAPI backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend will be live at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

In a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🧪 Running Automated Tests

The test suite validates PDF extraction, scanned document classification, OCR fallbacks, text chunking, Gemini API structured JSON parsing, prompt decontamination, and REST endpoints:

```bash
# From backend directory
cd backend
pytest tests/ -v
```

### Test Suite Highlights (18 Tests Passing):
- `test_decontamination_suite.py`: Verifies zero prompt leakage, mathematical KaTeX fidelity, and adversarial prompt injection safety.
- `test_document_service.py`: Standard PDF extraction, multi-page layout, and scanned PDF detection.
- `test_ocr_service.py`: Image preprocessing and Tesseract OCR execution.
- `test_chunking.py`: Paragraph-aware chunking with context overlap.
- `test_ai_service.py`: Structured JSON parsing and mocked LLM responses.
- `test_api_routes.py`: Endpoints (`/api/health`, `/api/upload`, `/api/summarize`, invalid format rejection).

---

## 📡 REST API Documentation

### 1. `GET /api/health`
Checks server health, Gemini configuration, and OCR subsystem readiness.
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "gemini_configured": true,
  "tesseract_available": true,
  "allowed_extensions": ["pdf", "png", "jpg", "jpeg", "webp", "bmp", "tiff", "tif"]
}
```

### 2. `POST /api/upload`
Uploads a document file (`multipart/form-data`) and extracts text without running AI summarization.
- **Returns**: `ExtractResponse` with document metadata and extracted text.

### 3. `POST /api/summarize`
Accepts extracted text and options to generate structured AI analysis.
- **Request Body**:
```json
{
  "text": "Extracted document text...",
  "summary_length": "medium",
  "api_key": "optional_user_override_key"
}
```
- **Returns**: `DocumentAnalysisResponse` (summary, key_points, main_ideas, improvement_suggestions).

### 4. `POST /api/process`
End-to-end multipart endpoint: Uploads file $\rightarrow$ Extracts text $\rightarrow$ Generates complete AI analysis.

---

## 🌐 Production Deployment Guide

### Deploying Backend to Render
1. Create a new **Web Service** on [Render.com](https://render.com).
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `GEMINI_API_KEY`: `your_gemini_api_key`
   - `GEMINI_MODEL`: `gemini-2.0-flash`
   - `CORS_ORIGINS`: `https://document-summary-assistant-ecru.vercel.app`

### Deploying Frontend to Vercel
1. Create a new project on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Set Environment Variable:
   - `VITE_API_URL`: `https://document-summary-assistant-api.onrender.com/api` (or your Render backend URL)
5. Click **Deploy**.

---

## 📄 License
MIT License • Built with ❤️ for intelligent document understanding.

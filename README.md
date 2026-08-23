# Document Summary Assistant 📄✨

An AI-powered, full-stack web application that ingests PDF documents and images, extracts high-fidelity text using **PyMuPDF** and **Tesseract OCR**, performs intelligent hierarchical chunking, and leverages the **Google Gemini API** to generate structured executive summaries (Short, Medium, Long), key takeaways, dynamic outlines, and actionable editorial improvements.

---

## 🌟 Executive Project Write-Up (200-Word Summary)

> **The Problem:** Modern professionals, researchers, and students face information overload, regularly spending hours reading lengthy PDFs, academic papers, and scanned image notes to extract core insights.
>
> **The Solution:** The **Document Summary Assistant** automates end-to-end document comprehension. Users upload text-based PDFs, scanned documents, or images. The system detects the file type, extracts clean text via PyMuPDF or Tesseract OCR, applies map-reduce chunking for large documents, and sends the content to Google Gemini AI to generate custom-length summaries, key takeaways, dynamic document outlines, and editorial improvement recommendations.
>
> **Architecture & Technologies:** Built with a decoupled **React 18 + Vite + Tailwind CSS** frontend and a high-performance **FastAPI (Python 3.12)** backend. Document parsing uses **PyMuPDF (`fitz`)** for native vector text extraction, with automatic fallback to **Tesseract OCR** (`pytesseract` + Pillow) for scanned documents. AI analysis utilizes the **Google Gemini API** (`gemini-1.5-flash` / `gemini-2.0-flash`) using structured JSON mode to prevent hallucinations.
>
> **Deployment:** Production-ready for zero-cost cloud deployment with frontend hosted on **Vercel** and backend deployed on **Render** with automatic temporary file purging.

---

## 🚀 Key Features

* **Multi-Format Ingestion**: Supports `.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, and `.tiff` files up to 25MB.
* **Native & OCR Extraction**:
  * **PyMuPDF (`fitz`)**: Fast, multi-page vector text extraction preserving paragraph flow and page boundaries.
  * **Tesseract OCR**: Preprocessed optical character recognition for scanned invoices, whiteboard notes, and screenshots.
  * **Automatic Scanned PDF Detection**: Evaluates character density per page and triggers OCR fallback when text is sparse or embedded as images.
* **Variable AI Summary Modes**:
  * **Short**: 3–5 concise, punchy sentences focusing strictly on core takeaways.
  * **Medium**: 1–3 balanced paragraphs with background context, evidence, and conclusions.
  * **Long**: In-depth, multi-section executive brief covering nuances, metrics, and methodology.
  * *Live Re-Summarization*: Switch lengths instantly without re-uploading the file.
* **5–10 Key Points**: Factual, scannable bullet points directly grounded in document content.
* **Dynamic Main Ideas & Outline**: Identifies real document sections (e.g., Executive Abstract, Methodology, Financial Results, Next Steps) rather than hardcoded headings.
* **Editorial Improvement Suggestions**: Pinpoints missing context, clarity issues, readability bottlenecks, or explicitly praises high clarity.
* **Raw Extracted Text Viewer**: Dedicated collapsible viewer with real-time text search and copy button to verify parser output.
* **Multi-Format Exporting**: Download full reports as Markdown (`.md`), Plain Text (`.txt`), Structured JSON (`.json`), or formatted PDF Print.
* **Text-to-Speech (TTS)**: Built-in audio reader to listen to generated summaries.
* **Flexible API Key Configuration**: Set `GEMINI_API_KEY` in backend `.env` or input personal free-tier keys directly in the UI modal.
* **Dark / Light Mode**: Seamless theme switching with system preference detection and localStorage persistence.

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
                                       │  REST API (Axios)
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
          [Text Cleaning & Normalization]                 │
                    │                                     │
                    ▼                                     │
          Is Document Large (>14k chars)?                 │
           ├── Yes ──► Map-Reduce Hierarchical Chunks     │
           └── No  ──► Single-Pass Analysis               │
                    │                                     │
                    ▼                                     │
          Google Gemini AI Model                          │
          (gemini-1.5-flash / gemini-2.0-flash)           │
                    │                                     │
                    ▼                                     │
          [Structured JSON Output]                        │
          • Summary (Short/Med/Long)                      │
          • Key Points (5-10)                             │
          • Main Ideas / Topics                           │
          • Improvement Suggestions                       │
                    │                                     │
                    ▼                                     │
             React Dashboard ◄────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite | Blazing fast build tooling, component modularity, instant HMR |
| **Styling** | Tailwind CSS, Lucide Icons | Responsive layout, dark/light theme tokens, clean accessible design |
| **Backend API** | FastAPI (Python 3.12) | Asynchronous execution, automatic OpenAPI docs, Pydantic type safety |
| **PDF Extraction** | PyMuPDF (`fitz`) | High-speed, accurate multi-page layout and text extraction |
| **OCR Engine** | Tesseract OCR (`pytesseract` + Pillow) | Open-source OCR with image preprocessing (grayscale, contrast boost) |
| **AI / LLM** | Google Gemini API (`google-generativeai`) | Generous free tier, fast inference, 1M+ context window, JSON mode |
| **Testing** | Pytest, FastAPI TestClient, ReportLab | Automated test suite with synthetic PDF and image sample generators |

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
GEMINI_MODEL=gemini-1.5-flash
PORT=8000
```
> 💡 *Don't have a key? Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).*

```bash
# Start FastAPI backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend will be live at `http://127.0.0.1:8000` with interactive docs at `http://127.0.0.1:8000/docs`.

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

The test suite validates PDF extraction, scanned document classification, OCR fallbacks, text chunking, Gemini API structured parsing, and REST endpoints.

```bash
# From the project root
cd backend
.\venv\Scripts\pytest tests/ -v
```

### Test Coverage Highlights:
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
  "summary_length": "short",
  "api_key": "optional_user_override_key"
}
```
- **Returns**: `DocumentAnalysisResponse` (summary, key points, main ideas, suggestions).

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
   - `GEMINI_MODEL`: `gemini-1.5-flash`
   - `CORS_ORIGINS`: `https://your-frontend-domain.vercel.app`

### Deploying Frontend to Vercel
1. Create a new project on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Set Environment Variable:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api`
5. Click **Deploy**.

---

## ⚠️ Limitations & Considerations

1. **OCR Accuracy**: OCR quality depends on image resolution, lighting, and handwriting clarity. Clean printed scans produce the best results.
2. **AI Rate Limits**: Free-tier Gemini keys have a rate limit of 15 requests per minute (RPM).
3. **Password-Protected PDFs**: Encrypted/password-locked PDFs cannot be read without a password.

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **Multi-language Translation**: Translate summaries into 30+ languages.
- [ ] **Chat with Document (Q&A)**: Interactive conversational drawer for asking targeted questions about the document.
- [ ] **Vector Search & RAG**: Semantic retrieval with source citation highlights.
- [ ] **Document Comparison**: Side-by-side comparative summary between two PDF versions.

---

## 📄 License
MIT License • Built with ❤️ for production document understanding.

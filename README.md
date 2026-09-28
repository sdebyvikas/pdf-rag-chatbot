# Full-Stack Enterprise RAG System (Feature-Based Architecture)

A complete Retrieval-Augmented Generation (RAG) platform with localized embeddings, sliding-window chunking, hybrid similarity retrieval, and Groq LPU inference .

---

## 🏗️ Architecture & Feature Boundaries

```text
Rag System/
├─ backend/
│  ├─ src/
│  │  ├─ features/
│  │  │  ├─ ingestion/       # PDF/DOCX/TXT parsers & sliding-window chunker
│  │  │  ├─ vector-store/    # Local all-MiniLM-L6-v2 embeddings & cosine index
│  │  │  ├─ retrieval/       # Top-K semantic similarity matching
│  │  │  └─ rag-chat/        # Strict citation prompt builder & Groq LLM client
│  │  ├─ routes.js           # Central API Router
│  │  └─ server.js           # Express App (Port 5000)
│  └─ data/
│     ├─ uploads/            # Raw uploaded documents
│     └─ storage/            # Persistent vector chunks & metadata (JSON)
│
├─ frontend/
│  ├─ src/
│  │  ├─ features/
│  │  │  ├─ chat/            # ChatArea, ChatInput, MessageItem, SourceCitation, SourceDrawer
│  │  │  └─ documents/       # DocumentUploader, DocumentCard, DocumentList
│  │  ├─ components/layout/  # Navbar, Sidebar, MainLayout
│  │  ├─ styles/index.css    # Modern dark theme, glassmorphism, glowing accents
│  │  └─ App.jsx
│  └─ vite.config.js         # React + Vite (Port 5173 with proxy)
```

---

## 🚀 Quick Start Guide

### 1. Configure Groq API Key

Open [backend/.env](file:///c:/Users/Acer/Documents/Rag%20System/backend/.env) and insert your Groq API key:

```env
PORT=5000
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

### 2. Seed Sample Knowledge Base (Optional)

```bash
cd backend
npm run seed
```

### 3. Start the Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### 4. Start the Frontend Application

```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 📡 API Reference

- `GET /api/health` - Server & Vector store status
- `POST /api/rag/upload` - Multipart file upload (PDF, DOCX, TXT, MD, CSV, JSON)
- `GET /api/rag/documents` - List indexed documents
- `DELETE /api/rag/documents/:id` - Delete document & remove vector chunks
- `POST /api/rag/chat` - RAG Query with history and citation retrieval
- `POST /api/rag/search` - Standalone semantic search without LLM generation

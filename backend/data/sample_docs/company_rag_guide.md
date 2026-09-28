# Enterprise RAG System Knowledge Base & Operations Guide

## 1. Overview and Architecture
Our enterprise Retrieval-Augmented Generation (RAG) platform combines lightweight localized embeddings with the Groq LPU inference engine to achieve sub-second question answering grounded in proprietary internal documents.

### Key Performance Specifications
- Target Query Latency: Under 1.2 seconds end-to-end.
- Default Chunk Size: 700 characters with 150 characters sliding overlap.
- Embedding Model: all-MiniLM-L6-v2 (384-dimensional dense semantic vectors).
- Primary LLM Engine: Groq Llama 3.3 70B Versatile (`llama-3.3-70b-versatile`).

## 2. Document Ingestion Policies
Supported file types include PDF (.pdf), Microsoft Word (.docx), Markdown (.md), Plain Text (.txt), CSV, and structured JSON files.
All uploaded documents undergo text cleaning, recursive boundary chunking (splitting at paragraph and sentence markers), and vector embedding before storage in the persistent index.

## 3. Human Resources & Leave Policy
- Annual Paid Time Off: Full-time employees receive 25 days of paid time off per calendar year.
- Leave Roll-over: A maximum of 5 unused leave days can be carried forward into the subsequent calendar year. All rolled-over days must be utilized before March 31st.
- Remote Work Stipend: Employees are entitled to a one-time home office setup stipend of $1,000 and a monthly internet reimbursement of $75.
- Health Insurance: Comprehensive medical, dental, and vision coverage begins on day one of employment with 100% company-paid premiums for employees and 80% for dependents.

## 4. Engineering & Deployment Guidelines
- All microservices and feature modules must adhere to strict typing and modular boundaries.
- Continuous Integration: Automated test suites must achieve at least 85% coverage before merging into the main production branch.
- Secrets Management: API keys and credentials (such as GROQ_API_KEY) must never be committed to Git repositories and must reside strictly in environment variables.

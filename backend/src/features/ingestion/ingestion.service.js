import path from 'path';
import crypto from 'crypto';
import { parsePdf } from './parsers/pdfParser.js';
import { parseDocx } from './parsers/docxParser.js';
import { parseText } from './parsers/textParser.js';
import { chunkDocumentText } from './chunker.service.js';
import { generateEmbedding } from '../vector-store/embedding.service.js';
import { vectorStore } from '../vector-store/vectorStore.service.js';
import { logger } from '../../core/utils/logger.js';

export async function processAndIndexFile(file) {
  const filePath = file.path;
  const originalName = file.originalname;
  const ext = path.extname(originalName).toLowerCase();
  const fileSize = file.size;
  const docId = `doc_${crypto.randomBytes(6).toString('hex')}`;

  logger.info(`Processing document: "${originalName}" (${ext}, ${fileSize} bytes)...`);

  let parsed = { text: '', pageCount: 1, metadata: {} };

  if (ext === '.pdf') {
    parsed = await parsePdf(filePath);
  } else if (ext === '.docx') {
    parsed = await parseDocx(filePath);
  } else if (['.txt', '.md', '.markdown', '.csv', '.json'].includes(ext)) {
    parsed = await parseText(filePath);
  } else {
    throw new Error(`Unsupported file type: ${ext}`);
  }

  if (!parsed.text || !parsed.text.trim()) {
    throw new Error(`No extractable text found in file: ${originalName}`);
  }

  // 1. Chunking
  const rawChunks = chunkDocumentText(parsed.text);
  logger.info(`Generated ${rawChunks.length} chunks for "${originalName}". Generating embeddings...`);

  // 2. Vectorization
  const indexedChunks = [];
  for (let i = 0; i < rawChunks.length; i++) {
    const chunk = rawChunks[i];
    const vector = await generateEmbedding(chunk.text);

    indexedChunks.push({
      id: `${docId}_chk_${i}`,
      docId,
      fileName: originalName,
      chunkIndex: i,
      text: chunk.text,
      charCount: chunk.charCount,
      vector,
      metadata: {
        pageCount: parsed.pageCount,
        startOffset: chunk.startOffset,
        endOffset: chunk.endOffset
      }
    });
  }

  // 3. Document Metadata Record
  const documentMeta = {
    id: docId,
    fileName: originalName,
    fileSize,
    fileType: ext.replace('.', '').toUpperCase(),
    pageCount: parsed.pageCount,
    chunkCount: indexedChunks.length,
    characterCount: parsed.text.length,
    status: 'indexed',
    createdAt: new Date().toISOString()
  };

  // 4. Save to Vector Store
  await vectorStore.addDocument(documentMeta, indexedChunks);

  return documentMeta;
}

export async function listAllDocuments() {
  return await vectorStore.listDocuments();
}

export async function removeDocument(docId) {
  return await vectorStore.deleteDocument(docId);
}

export async function resetKnowledgeBase() {
  await vectorStore.clearAll();
}

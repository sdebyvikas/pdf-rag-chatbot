import fs from 'fs/promises';
import path from 'path';
import { config } from '../../config/env.js';
import { logger } from '../../core/utils/logger.js';

class VectorStore {
  constructor() {
    this.documents = new Map(); // docId -> DocumentMeta
    this.chunks = []; // Array of { id, docId, fileName, chunkIndex, text, vector, metadata }
    this.storagePath = config.storageDir;
    this.docsFilePath = path.join(config.storageDir, 'documents.json');
    this.chunksFilePath = path.join(config.storageDir, 'chunks.json');
    this.isLoaded = false;
  }

  async init() {
    if (this.isLoaded) return;
    try {
      await fs.mkdir(this.storagePath, { recursive: true });

      try {
        const docsData = await fs.readFile(this.docsFilePath, 'utf-8');
        const parsedDocs = JSON.parse(docsData);
        for (const doc of parsedDocs) {
          this.documents.set(doc.id, doc);
        }
      } catch (err) {
        if (err.code !== 'ENOENT') logger.warn(`Could not load existing documents: ${err.message}`);
      }

      try {
        const chunksData = await fs.readFile(this.chunksFilePath, 'utf-8');
        this.chunks = JSON.parse(chunksData);
      } catch (err) {
        if (err.code !== 'ENOENT') logger.warn(`Could not load existing chunks: ${err.message}`);
      }

      this.isLoaded = true;
      logger.info(`Vector Store loaded: ${this.documents.size} documents, ${this.chunks.length} chunks.`);
    } catch (err) {
      logger.error(`Vector store initialization error: ${err.message}`);
    }
  }

  async persist() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
      const docsArray = Array.from(this.documents.values());
      await fs.writeFile(this.docsFilePath, JSON.stringify(docsArray, null, 2), 'utf-8');
      await fs.writeFile(this.chunksFilePath, JSON.stringify(this.chunks, null, 2), 'utf-8');
    } catch (err) {
      logger.error(`Failed to persist vector store to disk: ${err.message}`);
    }
  }

  async addDocument(documentMeta, chunkList) {
    await this.init();

    // Remove old versions of this document if any
    await this.deleteDocument(documentMeta.id, false);

    this.documents.set(documentMeta.id, documentMeta);
    this.chunks.push(...chunkList);

    await this.persist();
    logger.success(`Document '${documentMeta.fileName}' indexed with ${chunkList.length} chunks.`);
  }

  async deleteDocument(docId, shouldPersist = true) {
    await this.init();
    if (this.documents.has(docId)) {
      this.documents.delete(docId);
      this.chunks = this.chunks.filter(c => c.docId !== docId);
      if (shouldPersist) {
        await this.persist();
      }
      return true;
    }
    return false;
  }

  async listDocuments() {
    await this.init();
    return Array.from(this.documents.values());
  }

  async getDocument(docId) {
    await this.init();
    return this.documents.get(docId) || null;
  }

  async clearAll() {
    this.documents.clear();
    this.chunks = [];
    await this.persist();
    logger.info('Vector store cleared.');
  }

  /**
   * Calculates Cosine Similarity between two normalized vectors
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Hybrid similarity search: Cosine similarity + Keyword overlap boost
   */
  async similaritySearch(queryVector, queryText, topK = 4) {
    await this.init();

    if (this.chunks.length === 0) {
      return [];
    }

    const queryWords = queryText ? queryText.toLowerCase().split(/\s+/).filter(w => w.length > 2) : [];

    const scoredChunks = this.chunks.map(chunk => {
      const vectorScore = this.cosineSimilarity(queryVector, chunk.vector);

      // Lexical keyword matching boost
      let keywordBoost = 0;
      if (queryWords.length > 0) {
        const chunkTextLower = chunk.text.toLowerCase();
        let matchCount = 0;
        for (const word of queryWords) {
          if (chunkTextLower.includes(word)) {
            matchCount++;
          }
        }
        keywordBoost = (matchCount / queryWords.length) * 0.15; // up to 15% boost for exact keyword matches
      }

      const totalScore = Math.min(1.0, vectorScore + keywordBoost);

      return {
        id: chunk.id,
        docId: chunk.docId,
        fileName: chunk.fileName,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        score: parseFloat(totalScore.toFixed(4)),
        metadata: chunk.metadata || {}
      };
    });

    // Sort descending by score
    scoredChunks.sort((a, b) => b.score - a.score);

    return scoredChunks.slice(0, topK);
  }
}

export const vectorStore = new VectorStore();

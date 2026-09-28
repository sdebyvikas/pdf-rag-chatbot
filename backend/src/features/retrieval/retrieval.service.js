import { generateEmbedding } from '../vector-store/embedding.service.js';
import { vectorStore } from '../vector-store/vectorStore.service.js';
import { config } from '../../config/env.js';
import { logger } from '../../core/utils/logger.js';

/**
 * Retrieves the most relevant document chunks for a given query text.
 * 
 * @param {string} query 
 * @param {number} topK 
 * @param {number} minScoreThreshold 
 * @returns {Promise<Array<object>>}
 */
export async function retrieveRelevantContext(query, topK = config.topKDefault, minScoreThreshold = 0.1) {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const startTime = Date.now();
  const queryVector = await generateEmbedding(query);
  const searchResults = await vectorStore.similaritySearch(queryVector, query, topK);

  const filteredResults = searchResults.filter(chunk => chunk.score >= minScoreThreshold);
  const duration = Date.now() - startTime;

  logger.info(`Retrieved ${filteredResults.length} relevant chunks for query: "${query.substring(0, 40)}..." in ${duration}ms`);

  return filteredResults.map((chunk, index) => ({
    sourceId: index + 1,
    id: chunk.id,
    docId: chunk.docId,
    fileName: chunk.fileName,
    chunkIndex: chunk.chunkIndex,
    score: chunk.score,
    snippet: chunk.text,
    metadata: chunk.metadata
  }));
}

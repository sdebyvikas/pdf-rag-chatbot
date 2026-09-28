import { pipeline } from '@xenova/transformers';
import { config } from '../../config/env.js';
import { logger } from '../../core/utils/logger.js';

let extractorInstance = null;
let isInitializing = false;
let initPromise = null;

async function getExtractor() {
  if (extractorInstance) return extractorInstance;

  if (isInitializing) {
    return initPromise;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      logger.info(`Loading local embedding model: ${config.embeddingModel}...`);
      extractorInstance = await pipeline('feature-extraction', config.embeddingModel, {
        quantized: true
      });
      logger.success('Local embedding model initialized successfully');
      return extractorInstance;
    } catch (err) {
      logger.warn(`Transformers.js initialization warning: ${err.message}. Fallback vectorizer will be used.`);
      return null;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
}

/**
 * Lightweight fallback embedding generator using term frequency and character n-gram hashing
 * Produces deterministic 384-dimensional normalized vectors if ONNX weights aren't cached yet.
 */
function generateFallbackEmbedding(text, dimensions = 384) {
  const vector = new Float32Array(dimensions);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    vector[idx] += 1.0;

    // Bigram context
    if (i > 0) {
      const bigram = `${words[i - 1]}_${word}`;
      let biHash = 0;
      for (let j = 0; j < bigram.length; j++) {
        biHash = (biHash << 5) - biHash + bigram.charCodeAt(j);
        biHash |= 0;
      }
      const biIdx = Math.abs(biHash) % dimensions;
      vector[biIdx] += 1.5;
    }
  }

  // L2 Normalize
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] /= norm;
    }
  }

  return Array.from(vector);
}

/**
 * Generates normalized 384-dim embedding vector for given text
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text) {
  if (!text || typeof text !== 'string') {
    return new Array(384).fill(0);
  }

  try {
    const extractor = await getExtractor();
    if (extractor) {
      const output = await extractor(text, {
        pooling: 'mean',
        normalize: true
      });
      return Array.from(output.data);
    }
  } catch (err) {
    logger.warn(`Transformers extraction failed (${err.message}). Using fallback vectorizer.`);
  }

  return generateFallbackEmbedding(text);
}

/**
 * Generates embeddings for an array of texts in batches
 * @param {string[]} textArray 
 * @returns {Promise<number[][]>}
 */
export async function generateBatchEmbeddings(textArray) {
  const embeddings = [];
  for (const text of textArray) {
    const vector = await generateEmbedding(text);
    embeddings.push(vector);
  }
  return embeddings;
}

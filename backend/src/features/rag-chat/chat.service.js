import { getGroqClient } from '../../config/groqClient.js';
import { config } from '../../config/env.js';
import { retrieveRelevantContext } from '../retrieval/retrieval.service.js';
import { buildRagPromptMessages } from './promptBuilder.js';
import { logger } from '../../core/utils/logger.js';

export async function executeRagChat({ question, history = [], topK, model, temperature = 0.2, maxTokens = 1500 }) {
  const startTime = Date.now();

  // 1. Retrieve relevant chunks
  const k = topK || config.topKDefault;
  const retrievedChunks = await retrieveRelevantContext(question, k);

  // 2. Build prompt
  const messages = buildRagPromptMessages({
    question,
    history,
    retrievedChunks
  });

  // 3. Invoke Groq LLM
  const groq = getGroqClient();
  const selectedModel = model || config.groqModel;

  logger.info(`Sending prompt to Groq model: ${selectedModel} with ${retrievedChunks.length} context chunks...`);

  const completion = await groq.chat.completions.create({
    model: selectedModel,
    messages,
    temperature,
    max_tokens: maxTokens,
    top_p: 0.95
  });

  const durationMs = Date.now() - startTime;
  const answer = completion.choices?.[0]?.message?.content || 'No response generated.';

  logger.success(`Groq inference completed in ${durationMs}ms`);

  return {
    answer,
    sources: retrievedChunks.map(chunk => ({
      sourceId: chunk.sourceId,
      docId: chunk.docId,
      fileName: chunk.fileName,
      chunkIndex: chunk.chunkIndex,
      score: chunk.score,
      snippet: chunk.snippet
    })),
    metadata: {
      model: selectedModel,
      latencyMs: durationMs,
      retrievedChunksCount: retrievedChunks.length,
      usage: completion.usage || null
    }
  };
}

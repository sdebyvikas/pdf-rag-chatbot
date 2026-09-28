import { DEFAULT_RAG_SYSTEM_PROMPT } from './systemPrompts.js';

/**
 * Assembles the full message array for Groq Chat Completions API
 * 
 * @param {object} params
 * @param {string} params.question - Current user question
 * @param {Array<object>} params.history - Previous chat messages [{ role, content }]
 * @param {Array<object>} params.retrievedChunks - Matched source snippets from vector store
 * @param {string} [params.customSystemPrompt] - Optional custom system instructions
 * @returns {Array<object>} Formatted messages array for Groq LLM
 */
export function buildRagPromptMessages({ question, history = [], retrievedChunks = [], customSystemPrompt = null }) {
  let contextBlock = '';

  if (retrievedChunks.length === 0) {
    contextBlock = 'No matching document context was found in the knowledge base.';
  } else {
    contextBlock = retrievedChunks
      .map(chunk => {
        return `--- [Source ${chunk.sourceId}] Document: "${chunk.fileName}" (Relevance: ${(chunk.score * 100).toFixed(1)}%) ---
${chunk.snippet}`;
      })
      .join('\n\n');
  }

  const systemPromptContent = `${customSystemPrompt || DEFAULT_RAG_SYSTEM_PROMPT}

==================================================
DOCUMENT CONTEXT:
==================================================
${contextBlock}
==================================================`;

  const messages = [
    {
      role: 'system',
      content: systemPromptContent
    }
  ];

  // Append validated conversational history (keep last 8 turns to preserve context window)
  if (Array.isArray(history)) {
    const recentHistory = history.slice(-8);
    for (const msg of recentHistory) {
      if (msg && msg.role && msg.content && (msg.role === 'user' || msg.role === 'assistant')) {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }
  }

  // Current user question
  messages.push({
    role: 'user',
    content: question
  });

  return messages;
}

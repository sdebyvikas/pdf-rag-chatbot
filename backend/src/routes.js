import { Router } from 'express';
import { chatRouter } from './features/rag-chat/chat.routes.js';
import { ingestionRouter } from './features/ingestion/ingestion.routes.js';
import { retrievalRouter } from './features/retrieval/retrieval.routes.js';
import { vectorStore } from './features/vector-store/vectorStore.service.js';

export const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', async (req, res) => {
  const docs = await vectorStore.listDocuments();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    vectorStore: {
      documentsCount: docs.length,
      chunksCount: vectorStore.chunks.length
    }
  });
});

// Feature Routes
apiRouter.use('/rag', chatRouter);
apiRouter.use('/rag', ingestionRouter);
apiRouter.use('/rag', retrievalRouter);

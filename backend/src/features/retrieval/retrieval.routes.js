import { Router } from 'express';
import { retrieveRelevantContext } from './retrieval.service.js';

export const retrievalRouter = Router();

retrievalRouter.post('/search', async (req, res, next) => {
  try {
    const { query, topK, minScore } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }

    const results = await retrieveRelevantContext(query, topK ? parseInt(topK, 10) : undefined, minScore ? parseFloat(minScore) : undefined);

    res.json({
      success: true,
      query,
      count: results.length,
      results
    });
  } catch (err) {
    next(err);
  }
});

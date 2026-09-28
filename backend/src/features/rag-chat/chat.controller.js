import { executeRagChat } from './chat.service.js';

export async function handleRagChat(req, res, next) {
  try {
    const { question, history, topK, model, temperature, maxTokens } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A valid question string is required.'
      });
    }

    const result = await executeRagChat({
      question: question.trim(),
      history: Array.isArray(history) ? history : [],
      topK: topK ? parseInt(topK, 10) : undefined,
      model,
      temperature: temperature ? parseFloat(temperature) : undefined,
      maxTokens: maxTokens ? parseInt(maxTokens, 10) : undefined
    });

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
}

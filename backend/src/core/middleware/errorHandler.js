import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(`Error processing ${req.method} ${req.url}: ${err.message}`, err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

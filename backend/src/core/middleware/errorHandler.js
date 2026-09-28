import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(`Error processing ${req.method} ${req.url}: ${err.message}`, err.stack);

  let statusCode = err.statusCode || 500;
  if (err.name === 'MulterError' || err.message?.includes('Unsupported file type')) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

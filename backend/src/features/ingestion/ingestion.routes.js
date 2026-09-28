import { Router } from 'express';
import { upload } from '../../core/middleware/uploadMiddleware.js';
import { uploadDocuments, getDocuments, deleteDocumentById, clearAllDocuments } from './ingestion.controller.js';

export const ingestionRouter = Router();

// Upload multiple documents
ingestionRouter.post('/upload', upload.array('files', 10), uploadDocuments);

// List all indexed documents
ingestionRouter.get('/documents', getDocuments);

// Delete single document by ID
ingestionRouter.delete('/documents/:id', deleteDocumentById);

// Reset entire vector database
ingestionRouter.delete('/documents/clear-all', clearAllDocuments);

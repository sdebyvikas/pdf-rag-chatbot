import { processAndIndexFile, listAllDocuments, removeDocument, resetKnowledgeBase } from './ingestion.service.js';

export async function uploadDocuments(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded. Please attach at least one file.'
      });
    }

    const processedDocs = [];
    const errors = [];

    for (const file of req.files) {
      try {
        const doc = await processAndIndexFile(file);
        processedDocs.push(doc);
      } catch (err) {
        errors.push({
          fileName: file.originalname,
          error: err.message
        });
      }
    }

    res.status(200).json({
      success: true,
      indexedCount: processedDocs.length,
      documents: processedDocs,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    next(err);
  }
}

export async function getDocuments(req, res, next) {
  try {
    const documents = await listAllDocuments();
    res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteDocumentById(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await removeDocument(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: `Document ${id} not found.` });
    }
    res.json({ success: true, message: `Document ${id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
}

export async function clearAllDocuments(req, res, next) {
  try {
    await resetKnowledgeBase();
    res.json({ success: true, message: 'All documents and vector indexes cleared.' });
  } catch (err) {
    next(err);
  }
}

import { useState, useEffect, useCallback } from 'react';
import { fetchDocuments, uploadDocumentFiles, deleteDocument, clearAllKnowledgeBase } from '../services/documentApi.js';

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const loadDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const result = await uploadDocumentFiles(files);
      await loadDocuments();
      return result;
    } catch (err) {
      setUploadError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const removeDoc = async (id) => {
    try {
      await deleteDocument(id);
      await loadDocuments();
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const clearAll = async () => {
    try {
      await clearAllKnowledgeBase();
      setDocuments([]);
    } catch (err) {
      console.error('Failed to clear knowledge base:', err);
    }
  };

  return {
    documents,
    isUploading,
    isLoadingDocs,
    uploadError,
    uploadFiles,
    removeDoc,
    clearAll,
    refreshDocuments: loadDocuments
  };
}

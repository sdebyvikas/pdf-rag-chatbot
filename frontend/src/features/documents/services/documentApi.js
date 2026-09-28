export async function fetchDocuments() {
  const response = await fetch('/api/rag/documents');
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch indexed documents');
  }
  return data.documents || [];
}

export async function uploadDocumentFiles(fileList) {
  const formData = new FormData();
  for (let i = 0; i < fileList.length; i++) {
    formData.append('files', fileList[i]);
  }

  const response = await fetch('/api/rag/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to upload and index documents');
  }
  return data;
}

export async function deleteDocument(documentId) {
  const response = await fetch(`/api/rag/documents/${documentId}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete document');
  }
  return data;
}

export async function clearAllKnowledgeBase() {
  const response = await fetch('/api/rag/documents/clear-all', {
    method: 'DELETE'
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to clear knowledge base');
  }
  return data;
}

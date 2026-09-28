import React from 'react';
import { FileText, Trash2, Layers } from 'lucide-react';

export function DocumentCard({ doc, onDelete }) {
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="doc-card">
      <div className="doc-info">
        <div style={{ padding: '6px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '6px', color: '#818cf8' }}>
          <FileText size={18} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span className="doc-name" title={doc.fileName}>{doc.fileName}</span>
          <span className="doc-meta">
            {formatSize(doc.fileSize)} • {doc.chunkCount} chunks • {doc.fileType}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(doc.id)}
        className="icon-btn-delete"
        title="Delete document and vector index"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

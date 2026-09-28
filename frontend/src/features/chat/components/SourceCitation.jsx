import React from 'react';
import { FileText } from 'lucide-react';

export function SourceCitation({ sources = [], onSelectSource }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="sources-section">
      <div className="sources-label">
        <FileText size={13} />
        <span>Grounded Sources ({sources.length})</span>
      </div>
      <div className="sources-grid">
        {sources.map((source, idx) => {
          const scorePercent = (source.score * 100).toFixed(0);
          return (
            <button
              key={source.id || idx}
              className="source-badge"
              onClick={() => onSelectSource(source)}
              title={`Click to view snippet from ${source.fileName}`}
            >
              <span>[Source {source.sourceId || idx + 1}]</span>
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {source.fileName}
              </span>
              <span className="score-pill">{scorePercent}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

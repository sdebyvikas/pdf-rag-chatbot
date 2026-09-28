import React from 'react';
import { X, FileText, CheckCircle, Percent, Hash } from 'lucide-react';

export function SourceDrawer({ source, onClose }) {
  if (!source) return null;

  return (
    <div className="source-drawer">
      <div className="drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="#6366f1" />
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Source Inspector</h3>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="drawer-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Document Reference</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', wordBreak: 'break-all' }}>
            {source.fileName}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <div className="status-pill" style={{ flex: 1, justifyContent: 'center' }}>
              <Percent size={14} color="#10b981" />
              <span>Score: {(source.score * 100).toFixed(1)}%</span>
            </div>
            <div className="status-pill" style={{ flex: 1, justifyContent: 'center' }}>
              <Hash size={14} color="#06b6d4" />
              <span>Chunk #{source.chunkIndex + 1}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} color="#6366f1" />
            <span>Retrieved Text Chunk</span>
          </div>
          <div className="drawer-snippet-box">
            {source.snippet}
          </div>
        </div>
      </div>
    </div>
  );
}

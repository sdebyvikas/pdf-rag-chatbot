import React, { useState } from 'react';
import { Layers, Database, Sparkles, Server, Info, ShieldCheck } from 'lucide-react';
import { DocumentUploader } from '../../features/documents/components/DocumentUploader.jsx';
import { DocumentList } from '../../features/documents/components/DocumentList.jsx';

export function Sidebar({ documents, onUpload, isUploading, uploadError, onDeleteDoc, onClearAll, isLoadingDocs }) {
  const [activeTab, setActiveTab] = useState('docs'); // 'docs' | 'settings'

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="brand-icon">
            <Layers size={20} />
          </div>
          <div>
            <div className="brand-title">RAG Engine</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Semantic Knowledge Base</div>
          </div>
        </div>
        <span className="brand-badge">v1.0</span>
      </div>

      <div className="sidebar-tabs">
        <button
          className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <Database size={15} />
          <span>Documents</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <Info size={15} />
          <span>Architecture</span>
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'docs' ? (
          <>
            <DocumentUploader
              onUpload={onUpload}
              isUploading={isUploading}
              uploadError={uploadError}
            />
            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
            <DocumentList
              documents={documents}
              onDeleteDoc={onDeleteDoc}
              onClearAll={onClearAll}
              isLoading={isLoadingDocs}
            />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div style={{ padding: '12px', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#6366f1" />
                <span>Feature-Based RAG Flow</span>
              </div>
              <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Document upload & parsing (PDF/DOCX/TXT/MD)</li>
                <li>Recursive character chunking with 150-char overlap</li>
                <li>Local vectorization (MiniLM 384-dim)</li>
                <li>Top-K hybrid cosine similarity retrieval</li>
                <li>Grounded prompt assembly with citation IDs</li>
                <li>Groq LPU ultra-fast answer synthesis</li>
              </ol>
            </div>

            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontWeight: 600, color: '#6ee7b7', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} />
                <span>Strict Hallucination Control</span>
              </div>
              <div>The prompt forces the LLM to only answer if grounded in indexed documents.</div>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="status-pill">
          <span className="status-dot" />
          <Server size={14} />
          <span>RAG Backend: Port 5000 (Active)</span>
        </div>
      </div>
    </aside>
  );
}

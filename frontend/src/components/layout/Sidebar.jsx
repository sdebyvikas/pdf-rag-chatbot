import React, { useState } from 'react';
import { Layers, MessageSquarePlus, MessageSquare, Database, Trash2, Server, FileText } from 'lucide-react';
import { DocumentUploader } from '../../features/documents/components/DocumentUploader.jsx';
import { DocumentList } from '../../features/documents/components/DocumentList.jsx';

export function Sidebar({
  sessions = [],
  activeSessionId,
  onNewChat,
  onSwitchSession,
  onDeleteSession,
  documents,
  onUpload,
  isUploading,
  uploadError,
  onDeleteDoc,
  onClearAll,
  isLoadingDocs
}) {
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'docs'

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="brand-icon">
            <Layers size={20} />
          </div>
          <div>
            <div className="brand-title">RAG Engine</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Semantic Intelligence</div>
          </div>
        </div>
        <span className="brand-badge">v1.0</span>
      </div>

      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          <MessageSquare size={15} />
          <span>Chats ({sessions.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <Database size={15} />
          <span>Docs ({documents.length})</span>
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="sidebar-content">
        {activeTab === 'chats' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* New Chat Button */}
            <button
              className="btn-new-chat"
              onClick={onNewChat}
              title="Start a fresh conversation"
            >
              <MessageSquarePlus size={16} />
              <span>+ New Chat</span>
            </button>

            {/* Sessions List */}
            <div className="sessions-list">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px' }}>
                Recent Conversations
              </div>

              {sessions.map(session => {
                const isActive = session.id === activeSessionId;
                const msgCount = session.messages?.length || 0;

                return (
                  <div
                    key={session.id}
                    className={`session-item ${isActive ? 'active' : ''}`}
                    onClick={() => onSwitchSession(session.id)}
                  >
                    <div className="session-info">
                      <MessageSquare size={15} color={isActive ? "#818cf8" : "#64748b"} />
                      <span className="session-title" title={session.title}>
                        {session.title || "Untitled Chat"}
                      </span>
                    </div>

                    <button
                      className="session-delete-btn"
                      onClick={(e) => onDeleteSession(session.id, e)}
                      title="Delete chat"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Sidebar Footer */}
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

import React from 'react';
import { Zap, RefreshCw, MessageSquarePlus, Trash2 } from 'lucide-react';

export function Navbar({ activeTitle, onNewChat, onClearChat, messageCount, onRefreshDocs }) {
  return (
    <header className="chat-header">
      <div className="header-info">
        <h1 className="header-title" style={{ maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeTitle || "Enterprise Knowledge Assistant"}
        </h1>
        <div className="model-tag">
          <Zap size={12} color="#06b6d4" />
          <span>Groq AI Engine</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onNewChat}
          className="tab-btn"
          style={{ padding: '6px 12px', fontSize: '0.78rem', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', border: '1px solid rgba(99, 102, 241, 0.3)' }}
          title="Start new chat"
        >
          <MessageSquarePlus size={14} />
          <span>New Chat</span>
        </button>

        <button
          onClick={onRefreshDocs}
          className="tab-btn"
          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
          title="Refresh indexed knowledge base"
        >
          <RefreshCw size={14} />
          <span>Sync DB</span>
        </button>

        {messageCount > 0 && (
          <button
            onClick={onClearChat}
            className="tab-btn"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            title="Clear current conversation messages"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>
    </header>
  );
}

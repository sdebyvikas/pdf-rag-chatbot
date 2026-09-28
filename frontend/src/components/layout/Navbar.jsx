import React from 'react';
import { Cpu, Zap, RefreshCw } from 'lucide-react';

export function Navbar({ onClearChat, messageCount, onRefreshDocs }) {
  return (
    <header className="chat-header">
      <div className="header-info">
        <h1 className="header-title">Enterprise Knowledge Assistant</h1>
        <div className="model-tag">
          <Zap size={12} color="#06b6d4" />
          <span>Groq Llama 3.3 70B</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          >
            Clear Conversation
          </button>
        )}
      </div>
    </header>
  );
}

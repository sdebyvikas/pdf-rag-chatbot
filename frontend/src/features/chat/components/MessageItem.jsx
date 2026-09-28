import React from 'react';
import { User, Sparkles, AlertCircle } from 'lucide-react';
import { SourceCitation } from './SourceCitation.jsx';

export function MessageItem({ message, onSelectSource }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`message-bubble-wrapper ${isUser ? 'user' : 'assistant'}`}>
      <div className={`avatar ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>
        {isUser ? <User size={18} /> : isError ? <AlertCircle size={18} color="#ef4444" /> : <Sparkles size={18} />}
      </div>

      <div className="message-card">
        <div className="message-text">
          {message.content}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceCitation
            sources={message.sources}
            onSelectSource={onSelectSource}
          />
        )}

        <div style={{ marginTop: '8px', fontSize: '0.68rem', color: isUser ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', textAlign: isUser ? 'right' : 'left' }}>
          {message.timestamp} {message.metadata?.latencyMs ? `• ${(message.metadata.latencyMs / 1000).toFixed(2)}s` : ''}
        </div>
      </div>
    </div>
  );
}

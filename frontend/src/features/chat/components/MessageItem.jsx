import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Sparkles, AlertCircle, FileText } from 'lucide-react';
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
        {/* Attached files badge in user message */}
        {isUser && message.attachedFiles && message.attachedFiles.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
            {message.attachedFiles.map((file, idx) => (
              <div key={idx} className="user-attached-doc-pill">
                <FileText size={13} />
                <span>{file.name || file}</span>
              </div>
            ))}
          </div>
        )}

        {/* Formatted Markdown Content */}
        <div className="markdown-content">
          {isUser ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ node, ...props }) => (
                  <div className="table-responsive-wrapper">
                    <table {...props} />
                  </div>
                ),
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceCitation
            sources={message.sources}
            onSelectSource={onSelectSource}
          />
        )}

        <div style={{ marginTop: '10px', fontSize: '0.68rem', color: isUser ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', textAlign: isUser ? 'right' : 'left' }}>
          {message.timestamp} {message.metadata?.latencyMs ? `• ${(message.metadata.latencyMs / 1000).toFixed(2)}s` : ''}
        </div>
      </div>
    </div>
  );
}

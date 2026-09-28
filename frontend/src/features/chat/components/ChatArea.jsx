import React, { useRef, useEffect, useState } from 'react';
import { MessageItem } from './MessageItem.jsx';
import { Sparkles, HelpCircle, ArrowRight, UploadCloud, FileText } from 'lucide-react';

const SAMPLE_QUESTIONS = [
  "What is the annual paid time off policy?",
  "How many leave days can be rolled over to next year?",
  "What are the remote work stipend allowances?",
  "What is the target query latency of the RAG system?"
];

export function ChatArea({ messages, isLoading, isUploading, onSelectSource, onSampleClick, onDropFiles }) {
  const bottomRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isUploading]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      className="messages-container"
      style={{ position: 'relative' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragOver && (
        <div className="chat-dropzone-overlay">
          <UploadCloud size={48} color="#818cf8" />
          <h3>Drop PDF or Document to Chat</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            The document will be automatically indexed into vector storage.
          </p>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="welcome-screen">
          <div className="welcome-icon">
            <Sparkles size={32} />
          </div>
          <h2>Chat with Any Document</h2>
          <p>
            Attach a PDF using the paperclip 📎 button below, or ask questions grounded in your indexed knowledge base.
          </p>

          <div style={{ marginTop: '12px', width: '100%' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <HelpCircle size={14} />
              <span>Try asking one of these:</span>
            </div>
            <div className="sample-queries">
              {SAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  className="query-chip"
                  onClick={() => onSampleClick(q)}
                >
                  <span>{q}</span>
                  <ArrowRight size={13} color="#818cf8" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        messages.map(msg => (
          <MessageItem
            key={msg.id}
            message={msg}
            onSelectSource={onSelectSource}
          />
        ))
      )}

      {isUploading && (
        <div className="message-bubble-wrapper assistant">
          <div className="avatar assistant-avatar">
            <UploadCloud size={18} className="spin" />
          </div>
          <div className="message-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span className="status-dot" />
            <span>Parsing document, chunking, and creating local vector embeddings...</span>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="message-bubble-wrapper assistant">
          <div className="avatar assistant-avatar">
            <Sparkles size={18} />
          </div>
          <div className="message-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span className="status-dot" />
            <span>Searching vector knowledge base and synthesizing answer...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

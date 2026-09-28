import React, { useRef, useEffect } from 'react';
import { MessageItem } from './MessageItem.jsx';
import { BookOpen, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

const SAMPLE_QUESTIONS = [
  "What is the annual paid time off policy?",
  "How many leave days can be rolled over to next year?",
  "What are the remote work stipend allowances?",
  "What is the target query latency of the RAG system?"
];

export function ChatArea({ messages, isLoading, onSelectSource, onSampleClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="messages-container">
      {messages.length === 0 ? (
        <div className="welcome-screen">
          <div className="welcome-icon">
            <Sparkles size={32} />
          </div>
          <h2>Document Intelligence & RAG</h2>
          <p>
            Ask questions grounded strictly in your proprietary knowledge base. 
            All answers are retrieved with cosine similarity rankings and direct source citations.
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

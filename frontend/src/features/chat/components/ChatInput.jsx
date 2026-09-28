import React, { useState, useRef } from 'react';
import { Send, Loader2, Paperclip, X, FileText } from 'lucide-react';

export function ChatInput({ onSendMessage, isLoading, isUploading, placeholder, attachedFiles, onAddFiles, onRemoveFile }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isLoading || isUploading) return;
    if (!input.trim() && (!attachedFiles || attachedFiles.length === 0)) return;

    onSendMessage(input, attachedFiles);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      // Reset input value so same file can be chosen again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="chat-input-wrapper">
      {/* Attached Files Bar */}
      {attachedFiles && attachedFiles.length > 0 && (
        <div className="attached-files-bar">
          {attachedFiles.map((file, idx) => (
            <div key={idx} className="attached-file-chip">
              <FileText size={15} color="#818cf8" />
              <span className="chip-name" title={file.name}>{file.name}</span>
              <span className="chip-size">({formatSize(file.size)})</span>
              <button
                type="button"
                className="chip-remove-btn"
                onClick={() => onRemoveFile(idx)}
                title="Remove attached file"
                disabled={isLoading || isUploading}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Box Container */}
      <form onSubmit={handleSubmit} className="input-box-container">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.markdown,.csv,.json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Paperclip Button */}
        <button
          type="button"
          className="attach-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Attach PDF or documents to question"
          disabled={isLoading || isUploading}
        >
          {isUploading ? <Loader2 size={18} className="spin" /> : <Paperclip size={18} />}
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            attachedFiles && attachedFiles.length > 0
              ? `Ask anything about ${attachedFiles.map(f => f.name).join(', ')}...`
              : placeholder || "Attach a PDF or ask any question about your documents..."
          }
          rows={1}
          className="chat-textarea"
          disabled={isLoading || isUploading}
        />

        <button
          type="submit"
          disabled={isLoading || isUploading || (!input.trim() && (!attachedFiles || attachedFiles.length === 0))}
          className="send-btn"
          title="Send message"
        >
          {isLoading || isUploading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}

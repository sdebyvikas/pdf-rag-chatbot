import { useState, useCallback } from 'react';
import { sendRagQuery } from '../services/chatApi.js';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSourceModal, setActiveSourceModal] = useState(null); // Chunk object to inspect in drawer
  const [attachedFiles, setAttachedFiles] = useState([]);

  const addAttachedFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    setAttachedFiles(prev => [...prev, ...fileArray]);
  }, []);

  const removeAttachedFile = useCallback((index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAttachedFiles = useCallback(() => {
    setAttachedFiles([]);
  }, []);

  const sendMessage = useCallback(async (text, files = [], uploadHandler = null) => {
    const trimmed = (text || '').trim();
    const filesToUpload = files.length > 0 ? files : attachedFiles;

    if (!trimmed && filesToUpload.length === 0) return;
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    // 1. If files are attached, upload & vectorize them first
    if (filesToUpload.length > 0 && uploadHandler) {
      try {
        await uploadHandler(filesToUpload);
      } catch (err) {
        setError(`Failed to process attached document: ${err.message}`);
        setIsLoading(false);
        return;
      }
    }

    // Default question if user just dropped a PDF without typing text
    const finalQuestion = trimmed || (filesToUpload.length > 0 
      ? `Summarize the attached document (${filesToUpload.map(f => f.name).join(', ')}) and highlight its key points.`
      : '');

    const userMsgId = `user_${Date.now()}`;
    const userMessage = {
      id: userMsgId,
      role: 'user',
      content: finalQuestion,
      attachedFiles: filesToUpload.map(f => ({ name: f.name, size: f.size })),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    clearAttachedFiles();

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await sendRagQuery({
        question: finalQuestion,
        history: historyPayload
      });

      const assistantMsgId = `asst_${Date.now()}`;
      const assistantMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: res.answer,
        sources: res.sources || [],
        metadata: res.metadata || {},
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || 'Failed to communicate with RAG backend.');
      const errorMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        isError: true,
        content: `⚠️ Error: ${err.message || 'Unable to retrieve answer. Please make sure the backend is running and GROQ_API_KEY is configured in backend/.env.'}`,
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, attachedFiles, isLoading, clearAttachedFiles]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setActiveSourceModal(null);
    setAttachedFiles([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    activeSourceModal,
    setActiveSourceModal,
    attachedFiles,
    addAttachedFiles,
    removeAttachedFile,
    clearAttachedFiles
  };
}

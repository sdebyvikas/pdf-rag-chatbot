import { useState, useCallback } from 'react';
import { sendRagQuery } from '../services/chatApi.js';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSourceModal, setActiveSourceModal] = useState(null); // Chunk object to inspect in drawer

  const sendMessage = useCallback(async (text, topK = 4) => {
    if (!text || !text.trim() || isLoading) return;

    const trimmed = text.trim();
    const userMsgId = `user_${Date.now()}`;
    const userMessage = {
      id: userMsgId,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Pass clean history
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await sendRagQuery({
        question: trimmed,
        history: historyPayload,
        topK
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
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setActiveSourceModal(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    activeSourceModal,
    setActiveSourceModal
  };
}

import { useState, useEffect, useCallback } from 'react';
import { sendRagQuery } from '../services/chatApi.js';

const STORAGE_KEY = 'rag_chat_sessions_v1';
const ACTIVE_SESSION_KEY = 'rag_active_session_id_v1';

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function loadInitialSessions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load chat sessions from localStorage:', e);
  }

  // Default initial session
  const defaultSession = {
    id: generateSessionId(),
    title: 'New Conversation',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return [defaultSession];
}

function loadInitialActiveId(sessions) {
  try {
    const savedId = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (savedId && sessions.some(s => s.id === savedId)) {
      return savedId;
    }
  } catch (e) {
    console.error('Failed to load active session ID:', e);
  }
  return sessions[0]?.id || generateSessionId();
}

export function useChat() {
  const [sessions, setSessions] = useState(loadInitialSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => loadInitialActiveId(sessions));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSourceModal, setActiveSourceModal] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage:', e);
    }
  }, [sessions]);

  // Save activeSessionId to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
    } catch (e) {
      console.error('Failed to save active session ID:', e);
    }
  }, [activeSessionId]);

  // Current active session
  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || {
    id: activeSessionId,
    title: 'New Conversation',
    messages: []
  };

  const messages = currentSession.messages || [];

  // Create a new chat session
  const createNewSession = useCallback(() => {
    const newSession = {
      id: generateSessionId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setAttachedFiles([]);
    setError(null);
    setActiveSourceModal(null);
  }, []);

  // Switch to an existing session
  const switchSession = useCallback((sessionId) => {
    if (sessionId === activeSessionId) return;
    setActiveSessionId(sessionId);
    setAttachedFiles([]);
    setError(null);
    setActiveSourceModal(null);
  }, [activeSessionId]);

  // Delete a chat session
  const deleteSession = useCallback((sessionId, e) => {
    e?.stopPropagation();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh = {
          id: generateSessionId(),
          title: 'New Conversation',
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeSessionId]);

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

  // Send message inside active session
  const sendMessage = useCallback(async (text, files = [], uploadHandler = null) => {
    const trimmed = (text || '').trim();
    const filesToUpload = files.length > 0 ? files : attachedFiles;

    if (!trimmed && filesToUpload.length === 0) return;
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    // 1. Ingest attached file if present
    if (filesToUpload.length > 0 && uploadHandler) {
      try {
        await uploadHandler(filesToUpload);
      } catch (err) {
        setError(`Failed to index attached document: ${err.message}`);
        setIsLoading(false);
        return;
      }
    }

    const finalQuestion = trimmed || (filesToUpload.length > 0 
      ? `Summarize the attached document (${filesToUpload.map(f => f.name).join(', ')}) and highlight its core takeaways.`
      : '');

    const userMsgId = `user_${Date.now()}`;
    const userMessage = {
      id: userMsgId,
      role: 'user',
      content: finalQuestion,
      attachedFiles: filesToUpload.map(f => ({ name: f.name, size: f.size })),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Auto generate title if this is the first message
    const isFirstMessage = messages.length === 0;
    let autoTitle = currentSession.title;
    if (isFirstMessage) {
      if (filesToUpload.length > 0) {
        autoTitle = filesToUpload[0].name.replace(/\.[^/.]+$/, "");
      } else {
        autoTitle = finalQuestion.length > 28 ? `${finalQuestion.substring(0, 28)}...` : finalQuestion;
      }
    }

    // Append user message to active session
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: autoTitle,
          messages: [...s.messages, userMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    }));

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

      // Append assistant message
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, assistantMessage],
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      }));
    } catch (err) {
      setError(err.message || 'Failed to communicate with RAG backend.');
      const errorMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        isError: true,
        content: `⚠️ Error: ${err.message || 'Unable to retrieve answer. Please make sure the backend is running.'}`,
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, errorMessage],
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  }, [messages, attachedFiles, isLoading, activeSessionId, currentSession.title, clearAttachedFiles]);

  const clearChat = useCallback(() => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [],
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    }));
    setError(null);
    setActiveSourceModal(null);
    setAttachedFiles([]);
  }, [activeSessionId]);

  return {
    sessions,
    activeSessionId,
    currentSession,
    messages,
    isLoading,
    error,
    createNewSession,
    switchSession,
    deleteSession,
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

import React from 'react';
import { MainLayout } from './components/layout/MainLayout.jsx';
import { useChat } from './features/chat/hooks/useChat.js';
import { useDocuments } from './features/documents/hooks/useDocuments.js';

export default function App() {
  const {
    sessions,
    activeSessionId,
    currentSession,
    messages,
    isLoading,
    createNewSession,
    switchSession,
    deleteSession,
    sendMessage,
    clearChat,
    activeSourceModal,
    setActiveSourceModal,
    attachedFiles,
    addAttachedFiles,
    removeAttachedFile
  } = useChat();

  const {
    documents,
    isUploading,
    isLoadingDocs,
    uploadError,
    uploadFiles,
    removeDoc,
    clearAll,
    refreshDocuments
  } = useDocuments();

  return (
    <MainLayout
      sessions={sessions}
      activeSessionId={activeSessionId}
      currentSession={currentSession}
      onNewChat={createNewSession}
      onSwitchSession={switchSession}
      onDeleteSession={deleteSession}
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
      onClearChat={clearChat}
      activeSourceModal={activeSourceModal}
      setActiveSourceModal={setActiveSourceModal}
      documents={documents}
      onUpload={uploadFiles}
      isUploading={isUploading}
      uploadError={uploadError}
      onDeleteDoc={removeDoc}
      onClearAll={clearAll}
      isLoadingDocs={isLoadingDocs}
      onRefreshDocs={refreshDocuments}
      attachedFiles={attachedFiles}
      onAddFiles={addAttachedFiles}
      onRemoveFile={removeAttachedFile}
    />
  );
}

import React from "react";
import { MainLayout } from "./components/layout/MainLayout.jsx";
import { useChat } from "./features/chat/hooks/useChat.js";
import { useDocuments } from "./features/documents/hooks/useDocuments.js";

export default function App() {
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    activeSourceModal,
    setActiveSourceModal,
  } = useChat();

  const {
    documents,
    isUploading,
    isLoadingDocs,
    uploadError,
    uploadFiles,
    removeDoc,
    clearAll,
    refreshDocuments,
  } = useDocuments();

  return (
    <MainLayout
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
    />
  );
}

import React from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Navbar } from './Navbar.jsx';
import { ChatArea } from '../../features/chat/components/ChatArea.jsx';
import { ChatInput } from '../../features/chat/components/ChatInput.jsx';
import { SourceDrawer } from '../../features/chat/components/SourceDrawer.jsx';

export function MainLayout({
  sessions,
  activeSessionId,
  currentSession,
  onNewChat,
  onSwitchSession,
  onDeleteSession,
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  activeSourceModal,
  setActiveSourceModal,
  documents,
  onUpload,
  isUploading,
  uploadError,
  onDeleteDoc,
  onClearAll,
  isLoadingDocs,
  onRefreshDocs,
  attachedFiles,
  onAddFiles,
  onRemoveFile
}) {
  return (
    <div className="app-container">
      {/* Knowledge Base & Chat Sessions Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={onNewChat}
        onSwitchSession={onSwitchSession}
        onDeleteSession={onDeleteSession}
        documents={documents}
        onUpload={onUpload}
        isUploading={isUploading}
        uploadError={uploadError}
        onDeleteDoc={onDeleteDoc}
        onClearAll={onClearAll}
        isLoadingDocs={isLoadingDocs}
      />

      {/* Main Chat Viewport */}
      <main className="main-viewport">
        <Navbar
          activeTitle={currentSession?.title}
          onNewChat={onNewChat}
          onClearChat={onClearChat}
          messageCount={messages.length}
          onRefreshDocs={onRefreshDocs}
        />

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          isUploading={isUploading}
          onSelectSource={setActiveSourceModal}
          onSampleClick={(q) => onSendMessage(q, [], onUpload)}
          onDropFiles={onAddFiles}
        />

        <ChatInput
          onSendMessage={(text, files) => onSendMessage(text, files, onUpload)}
          isLoading={isLoading}
          isUploading={isUploading}
          attachedFiles={attachedFiles}
          onAddFiles={onAddFiles}
          onRemoveFile={onRemoveFile}
        />
      </main>

      {/* Source Citation Inspector Drawer */}
      <SourceDrawer
        source={activeSourceModal}
        onClose={() => setActiveSourceModal(null)}
      />
    </div>
  );
}

import React from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Navbar } from './Navbar.jsx';
import { ChatArea } from '../../features/chat/components/ChatArea.jsx';
import { ChatInput } from '../../features/chat/components/ChatInput.jsx';
import { SourceDrawer } from '../../features/chat/components/SourceDrawer.jsx';

export function MainLayout({
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
  onRefreshDocs
}) {
  return (
    <div className="app-container">
      {/* Knowledge Base Sidebar */}
      <Sidebar
        documents={documents}
        onUpload={onUpload}
        isUploading={isUploading}
        uploadError={uploadError}
        onDeleteDoc={onDeleteDoc}
        onClearAll={onClearAll}
        isLoadingDocs={isLoadingDocs}
      />

      {/* Main Chat Interface */}
      <main className="main-viewport">
        <Navbar
          onClearChat={onClearChat}
          messageCount={messages.length}
          onRefreshDocs={onRefreshDocs}
        />

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onSelectSource={setActiveSourceModal}
          onSampleClick={onSendMessage}
        />

        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
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
